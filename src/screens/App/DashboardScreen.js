import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, 
  RefreshControl, ActivityIndicator 
} from 'react-native';
import { collection, query, orderBy, onSnapshot, where, limit } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { COLORS, SPACING } from '../../theme/theme';
import { calculateWindowStatus } from '../../utils/windowLogic';
import { MessageSquare, ShoppingBag, UserPlus, Bot, User, Clock } from 'lucide-react-native';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <Icon size={20} color={color} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const ChatItem = ({ chat, onPress }) => {
  const window = calculateWindowStatus(chat.lastMessageTimestamp);
  const isAgent = chat.status === 'agent';

  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => onPress(chat)}>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatNumber}>{chat.id || chat.whatsappNumber}</Text>
          <View style={[styles.windowBadge, { backgroundColor: window.color + '20' }]}>
            <Clock size={12} color={window.color} />
            <Text style={[styles.windowText, { color: window.color }]}>{window.label}</Text>
          </View>
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={1}>
          {chat.lastMessage || 'Sin mensajes todavía'}
        </Text>

        <View style={styles.chatFooter}>
          <Text style={styles.timeText}>{chat.lastMessageTime || 'Reciente'}</Text>
          <View style={styles.statusBadge}>
            {isAgent ? (
              <User size={14} color={COLORS.primary} />
            ) : (
              <Bot size={14} color={COLORS.textMuted} />
            )}
            <Text style={[styles.statusText, { color: isAgent ? COLORS.primary : COLORS.textMuted }]}>
              {isAgent ? 'ASESOR' : 'BOT'}
            </Text>
          </View>
        </View>
      </View>
      {chat.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

export default function DashboardScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({ active: 0, orders: 0, clients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Chats
    const qChats = query(collection(db, 'chats'), orderBy('lastMessageTimestamp', 'desc'), limit(50));
    const unsubChats = onSnapshot(qChats, (snap) => {
      const chatList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
      setStats(prev => ({ ...prev, active: chatList.length }));
      setLoading(false);
    });

    // 2. Listen to Today's Orders (simplified)
    const today = new Date();
    today.setHours(0,0,0,0);
    const qOrders = query(collection(db, 'orders'), where('createdAt', '>=', today));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setStats(prev => ({ ...prev, orders: snap.size }));
    });

    return () => {
      unsubChats();
      unsubOrders();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard title="Activas" value={stats.active} icon={MessageSquare} color={COLORS.primary} />
        <StatCard title="Pedidos" value={stats.orders} icon={ShoppingBag} color={COLORS.windowGreen} />
        <StatCard title="Nuevos" value={stats.clients} icon={UserPlus} color={COLORS.windowYellow} />
      </View>

      <Text style={styles.sectionTitle}>Conversaciones Recientes</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={(chat) => navigation.navigate('Chat', { chatId: chat.id, name: chat.customerName })} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 10,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  listContent: {
    padding: SPACING.md,
  },
  chatItem: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatNumber: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  windowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  windowText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  }
});

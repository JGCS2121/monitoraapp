import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TextInput, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { COLORS, SPACING } from '../../theme/theme';
import { Search, Calendar, ChevronRight } from 'lucide-react-native';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Fetching last 100 closed or past conversations
      const q = query(
        collection(db, 'chats'), 
        orderBy('lastMessageTimestamp', 'desc'),
        limit(100)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(chat => 
    chat.id.includes(searchTerm) || 
    (chat.customerName && chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número o nombre..."
          placeholderTextColor={COLORS.textMuted}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.historyItem}
              onPress={() => navigation.navigate('Chat', { chatId: item.id, name: item.customerName })}
            >
              <View>
                <Text style={styles.historyNumber}>{item.id}</Text>
                <Text style={styles.historyName}>{item.customerName || 'Cliente sin nombre'}</Text>
                <Text style={styles.historyDate}>{item.lastMessageTime || 'Fecha no disponible'}</Text>
              </View>
              <ChevronRight size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron conversaciones</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    margin: SPACING.md,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    marginLeft: 10,
    fontSize: 14,
  },
  listContent: {
    padding: SPACING.md,
  },
  historyItem: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  historyNumber: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyName: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 2,
  },
  historyDate: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
  }
});

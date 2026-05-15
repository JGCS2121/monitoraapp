import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, doc, updateDoc 
} from 'firebase/firestore';
import { db } from '../../api/firebase';
import { COLORS, SPACING } from '../../theme/theme';
import { calculateWindowStatus } from '../../utils/windowLogic';
import { Send, Bot, User, ShieldAlert, RotateCcw } from 'lucide-react-native';

export default function ChatScreen({ route }) {
  const { chatId, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatData, setChatData] = useState(null);
  const [window, setWindow] = useState({ status: 'closed', label: '--' });
  const flatListRef = useRef();

  useEffect(() => {
    // 1. Listen to Chat Data (status, last message)
    const unsubChat = onSnapshot(doc(db, 'chats', chatId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setChatData(data);
        setWindow(calculateWindowStatus(data.lastMessageTimestamp));
      }
    });

    // 2. Listen to Messages
    const q = query(
      collection(db, 'chats', chatId, 'messages'), 
      orderBy('timestamp', 'asc')
    );
    const unsubMsgs = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    // 3. Update window every minute
    const interval = setInterval(() => {
      if (chatData) {
        setWindow(calculateWindowStatus(chatData.lastMessageTimestamp));
      }
    }, 60000);

  return () => {
    unsubChat();
    unsubMsgs();
    clearInterval(interval);
  };
}, [chatId, chatData?.lastMessageTimestamp]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || window.status === 'closed') return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: inputText,
        sender: 'agent',
        timestamp: serverTimestamp(),
      });
      
      // Update last message in chat doc
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: inputText,
        lastMessageTimestamp: Date.now(),
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setInputText('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo enviar el mensaje');
    }
  };

  const toggleControl = async () => {
    const isAgent = chatData?.status === 'agent';
    const newStatus = isAgent ? 'bot' : 'agent';
    
    try {
      await updateDoc(doc(db, 'chats', chatId), { status: newStatus });
    } catch (err) {
      Alert.alert('Error', 'No se pudo cambiar el control');
    }
  };

  const renderMessage = ({ item }) => {
    const isClient = item.sender === 'client';
    const isBot = item.sender === 'bot';
    const isAgent = item.sender === 'agent';

    return (
      <View style={[
        styles.messageWrapper, 
        isClient ? styles.clientWrapper : styles.agentWrapper
      ]}>
        <View style={[
          styles.bubble,
          isClient && styles.clientBubble,
          isBot && styles.botBubble,
          isAgent && styles.agentBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
        </View>
        {isBot && <Bot size={12} color={COLORS.textMuted} style={styles.botIcon} />}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Window Header */}
      <View style={[styles.windowHeader, { backgroundColor: window.color + '15' }]}>
        <Text style={[styles.windowLabel, { color: window.color }]}>
          VENTANA: {window.label}
        </Text>
        <TouchableOpacity 
          style={[styles.controlBtn, { backgroundColor: chatData?.status === 'agent' ? COLORS.windowGreen : COLORS.windowRed }]}
          onPress={toggleControl}
        >
          {chatData?.status === 'agent' ? (
            <RotateCcw size={16} color="white" />
          ) : (
            <ShieldAlert size={16} color="white" />
          )}
          <Text style={styles.controlBtnText}>
            {chatData?.status === 'agent' ? 'DEVOLVER AL BOT' : 'TOMAR CONTROL'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Area */}
      <View style={styles.inputArea}>
        {window.status === 'closed' ? (
          <View style={styles.closedWindowMsg}>
            <Text style={styles.closedText}>Ventana cerrada - Solo puedes usar plantillas aprobadas</Text>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  windowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  windowLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controlBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.md,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  clientWrapper: {
    alignSelf: 'flex-start',
  },
  agentWrapper: {
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  clientBubble: {
    backgroundColor: COLORS.clientBubble,
    borderBottomLeftRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.botBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  agentBubble: {
    backgroundColor: COLORS.agentBubble,
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  botIcon: {
    marginTop: 4,
    marginLeft: 4,
  },
  inputArea: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  closedWindowMsg: {
    padding: 8,
    alignItems: 'center',
  },
  closedText: {
    color: COLORS.windowRed,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

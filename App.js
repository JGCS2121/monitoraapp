import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Alert, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { COLORS } from './src/theme/theme';
import { auth, onAuthStateChanged } from './src/api/firebase';
import { RootNavigator } from './src/navigation/RootNavigator';

// Ignorar warnings innecesarios
LogBox.ignoreAllLogs();

// Manejo de errores globales
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('CRITICAL ERROR:', error);
  Alert.alert("Error de Aplicación", error.message);
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function AppContent() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    if (!auth || !onAuthStateChanged) {
      setInitError('Firebase no pudo inicializarse.');
      setInitializing(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    }, (error) => {
      console.error('Auth error:', error);
      setInitError('Error de autenticación: ' + error.message);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 12 }}>Iniciando Monitor...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: '#EF4444', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>⚠️ Error de Firebase</Text>
        <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>{initError}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <RootNavigator user={user} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

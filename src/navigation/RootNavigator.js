import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import DashboardScreen from '../screens/App/DashboardScreen';
import ChatScreen from '../screens/App/ChatScreen';
import HistoryScreen from '../screens/App/HistoryScreen';
import { COLORS } from '../theme/theme';

const Stack = createStackNavigator();

export const RootNavigator = ({ user }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
          letterSpacing: 1,
        },
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {!user ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen} 
            options={{ title: 'STYLE AETERNUM' }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={({ route }) => ({ title: route.params.name || 'Chat' })}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Historial' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

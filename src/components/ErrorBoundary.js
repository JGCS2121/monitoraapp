import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('🚨 APP CRASH:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>🚨 Error al iniciar</Text>
          <Text style={styles.subtitle}>Copia este mensaje y compártelo:</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.errorText}>
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.errorInfo?.componentStack}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 16,
  },
  scroll: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  errorText: {
    color: '#FACC15',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡LA APP FUNCIONA!</Text>
      <Text style={styles.subtext}>Si ves esto, el problema era un error de texto.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#4ADE80',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#A0A0A0',
    marginTop: 10,
  },
});


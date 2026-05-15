import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [status, setStatus] = useState("Esperando...");

  const probarFirebase = () => {
    try {
      setStatus("Intentando cargar Firebase...");
      // Intentamos cargar Firebase solo cuando pulsas el botón
      const { auth } = require('./src/api/firebase');
      if (auth) {
        Alert.alert("Éxito", "Firebase cargado correctamente");
        setStatus("Firebase OK");
      }
    } catch (error) {
      Alert.alert("Error en Firebase", error.message);
      setStatus("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STYLE AETERNUM MONITOR</Text>
      <Text style={styles.status}>Estado: {status}</Text>
      
      <TouchableOpacity style={styles.button} onPress={probarFirebase}>
        <Text style={styles.buttonText}>PROBAR CONEXIÓN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: { color: '#4ADE80', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  status: { color: '#A0A0A0', marginBottom: 40 },
  button: { backgroundColor: '#4ADE80', padding: 15, borderRadius: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' }
});

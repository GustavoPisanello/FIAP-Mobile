import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth } from './src/config/firebase';
import { SafeAreaProvider, } from "react-native-safe-area-context";
import { HomeScreen } from './src/screens/HomeScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function App() {

  GoogleSignin.configure({
    webClientId: "770526641984-0tvrrsej2rr8nepigbpn8rdiddp340nl.apps.googleusercontent.com"
  })

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    })

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      {user ? (<HomeScreen />) : (<AuthScreen />)}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

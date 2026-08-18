import React, { useEffect, useState, } from "react";
import { ActivityIndicator, StyleSheet, View, } from "react-native";
import { onAuthStateChanged, User, } from "firebase/auth";
import { auth, } from "./src/config/firebase";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { SafeAreaProvider, } from "react-native-safe-area-context";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
        (firebaseUser) => {
          setUser(
            firebaseUser
          );
          setLoading(false);
        }
      );
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large"/>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {user ? (  <HomeScreen /> ) : (  <AuthScreen /> )}
    </SafeAreaProvider>
  );
}

const styles =
  StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

  });
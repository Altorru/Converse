import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../composables/Auth";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    // Set authentication state to true with user information
    signIn(email, password)
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch((error) => {
        setErrorText(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    <Text style={styles.registerText} onPress={() => router.push("/register")}>
        Pas de compte ? S'enregistrer
    </Text>
      <Button title="Connexion" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
    registerText: {
        color: "blue",
        marginBottom: 12,
        textAlign: "center",
    },
});

export default LoginScreen;

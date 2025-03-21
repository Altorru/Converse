import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "@/composables/Auth";
import { useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";

export default function LoginScreen() {
  const styles = useThemeStyles();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      if (err.message === "missing email or phone") {
        setError("Email manquant");
      } else if (err.message === "Invalid login credentials") {
        setError("Identifiants incorrects");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Connexion
      </Text>
      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}
      <TextInput
        style={styles.TextInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={"lightgray"}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={"lightgray"}
        secureTextEntry
      />
      <Text
        style={styles.registerText}
        onPress={() => router.push("/register")}
      >
        Pas de compte? S'enregistrer
      </Text>
      <Button title="Connexion" onPress={handleLogin} />
    </View>
  );
}
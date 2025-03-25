import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "@/composables/Auth";
import { useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";
import UIButton from "@/components/ui/Button";
import UILoading from "@/components/ui/Loading";
import UITextInput from "@/components/ui/TextInput";

export default function LoginScreen() {
  const styles = useThemeStyles();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn(email, password);
      setIsLoading(false);
      router.replace("/(tabs)");
    } catch (err: any) {
      if (err.message === "missing email or phone") {
        setError("Email manquant");
      } else if (err.message === "Invalid login credentials") {
        setError("Identifiants incorrects");
      } else {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <UILoading visible={isLoading}/>
      <Text style={styles.title}>
      Connexion
      </Text>
      {error ? (
      <Text style={styles.errorText}>
        {error}
      </Text>
      ) : null}
      <UITextInput
      placeholder="Email"
      value={email}
      keyboardType="email-address"
      autoCapitalize="none"
      onChangeText={setEmail}
      />
      <UITextInput
      placeholder="Mot de passe"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      />
      <Text
      style={styles.registerText}
      onPress={() => router.push("/register")}
      >
      Pas de compte? S'enregistrer
      </Text>
      <UIButton textContent="Connexion" onPress={handleLogin} />
    </View>
  );
}
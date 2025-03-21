import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "@/composables/Auth";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const lightTheme = useColorScheme() === "light";

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
    <View style={lightTheme ? stylesLight.container : stylesDark.container}>
      <Text style={lightTheme ? stylesLight.title : stylesDark.title}>
        Connexion
      </Text>
      {error ? (
        <Text style={lightTheme ? stylesLight.errorText : stylesDark.errorText}>
          {error}
        </Text>
      ) : null}
      <TextInput
        style={lightTheme ? stylesGlobal.TextInput : stylesDark.TextInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={lightTheme ? "gray" : "lightgray"}
      />
      <TextInput
        style={lightTheme ? stylesGlobal.TextInput : stylesDark.TextInput}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={lightTheme ? "gray" : "lightgray"}
        secureTextEntry
      />
      <Text
        style={lightTheme ? stylesLight.registerText : stylesDark.registerText}
        onPress={() => router.push("/register")}
      >
        Pas de compte? S'enregistrer
      </Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const stylesGlobal = StyleSheet.create({
  TextInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    marginBottom: 12,
    textAlign: "center",
  },
  registerText: {
    marginBottom: 12,
    textAlign: "center",
  },
});

const stylesLight = StyleSheet.create({
  container: {
    ...stylesGlobal.container,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  errorText: {
    ...stylesGlobal.errorText,
    color: "red",
  },
  registerText: {
    ...stylesGlobal.registerText,
    color: "blue",
  },
});

const stylesDark = StyleSheet.create({
  container: {
    ...stylesGlobal.container,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  errorText: {
    ...stylesGlobal.errorText,
    color: "red",
  },
  registerText: {
    ...stylesGlobal.registerText,
    color: "lightblue",
  },
  TextInput: {
    ...stylesGlobal.TextInput,
    color: "white",
  },
});

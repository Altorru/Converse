import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../composables/Auth";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorText, setErrorText] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = () => {
    // Set authentication state to true with user information
    register(email, password, firstName, lastName)
      .then((user) => {
        console.log("User signed in", user?.id);
        router.replace("/(tabs)");
      })
      .catch((error) => {
        setErrorText(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        keyboardType="default"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        keyboardType="default"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    <Text style={styles.loginText} onPress={() => router.push("/login")}>
        Already have an account ? Login
    </Text>
      <Button title="Register" onPress={handleRegister} />
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
    loginText: {
        color: "blue",
        marginBottom: 12,
        textAlign: "center",
    },
});

export default RegisterScreen;

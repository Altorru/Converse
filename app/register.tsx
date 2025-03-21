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
  const { register, refreshUser } = useAuth();
  const router = useRouter();

  const handleRegister = () => {
    // Before calling the register function, check the form is valid
    if (!email || !password || !firstName || !lastName) {
      setErrorText("Veuillez remplir tous les champs");
    } else {
      // Check if the email is valid
      if (!email.includes("@") || !email.includes(".")) {
        setErrorText("Veuillez renseigner un email valide");
      } else {
        register(email, password, firstName, lastName)
          .then((user) => {
            console.log("User signed in", user?.id);
            refreshUser();
            router.replace("/(tabs)");
          })
          .catch((error) => {
            if (error.code === "validation_failed") {
              setErrorText("Veuillez vérifier les champs");
            } else if (error.code === "anonymous_provider_disabled") {
              setErrorText("Veuillez renseigner un email");
            } else if (error.code === "user_already_exists") {
              setErrorText("Un compte existe déjà avec cet email");
            } else {
              setErrorText(error.code);
            }
          });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>S'enregistrer</Text>
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
        Déja un compte ? Connexion
      </Text>
      <Button title="S'enregitrer" onPress={handleRegister} />
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

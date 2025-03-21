import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, useColorScheme } from "react-native";
import { useAuth } from "../composables/Auth";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorText, setErrorText] = useState("");
  const { register, refreshUser } = useAuth();
  const lightTheme = useColorScheme() === "light";
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
    <View style={lightTheme ? stylesLight.container : stylesDark.container}>
      <Text style={lightTheme ? stylesLight.title : stylesDark.title}>S'enregistrer</Text>
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
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        keyboardType="default"
        autoCapitalize="words"
        placeholderTextColor={lightTheme ? "gray" : "lightgray"}
      />
      <TextInput
        style={lightTheme ? stylesGlobal.TextInput : stylesDark.TextInput}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        keyboardType="default"
        autoCapitalize="words"
        placeholderTextColor={lightTheme ? "gray" : "lightgray"}
      />
      <TextInput
        style={lightTheme ? stylesGlobal.TextInput : stylesDark.TextInput}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={lightTheme ? "gray" : "lightgray"}
      />
      {errorText ? <Text style={lightTheme ? stylesLight.errorText : stylesDark.errorText}>{errorText}</Text> : null}
      <Text style={lightTheme ? stylesLight.registerText : stylesDark.registerText} onPress={() => router.push("/login")}>
        Déja un compte ? Connexion
      </Text>
      <Button title="S'enregitrer" onPress={handleRegister} />
    </View>
  );
};

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


export default RegisterScreen;

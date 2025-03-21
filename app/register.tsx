import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../composables/Auth";
import { useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";
import UIButton from "@/components/ui/Button";
import UILoading from "@/components/ui/Loading";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorText, setErrorText] = useState("");
  const { register, refreshUser } = useAuth();
  const router = useRouter();
  const styles = useThemeStyles();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    // Before calling the register function, check the form is valid
    if (!email || !password || !firstName || !lastName) {
      setErrorText("Veuillez remplir tous les champs");
    } else {
      // Check if the email is valid
      if (!email.includes("@") || !email.includes(".")) {
        setErrorText("Veuillez renseigner un email valide");
      } else {
        setIsLoading(true);
        register(email, password, firstName, lastName)
          .then((user) => {
            console.log("User signed in", user?.id);
            refreshUser();
            setIsLoading(false);
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
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.container}>
      <UILoading visible={isLoading}/>
      <Text style={styles.title}>S'enregistrer</Text>
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
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        keyboardType="default"
        autoCapitalize="words"
        placeholderTextColor={"lightgray"}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        keyboardType="default"
        autoCapitalize="words"
        placeholderTextColor={"lightgray"}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={"lightgray"}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      <Text style={styles.registerText} onPress={() => router.push("/login")}>
        Déja un compte ? Connexion
      </Text>
      <UIButton textContent="S'enregistrer" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;

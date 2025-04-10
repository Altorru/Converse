import React, { useState } from "react";
import { View, Text } from "react-native";
import { useAuth, AuthProvider } from "../composables/Auth";
import { useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";
import UIButton from "@/components/ui/Button";
import UILoading from "@/components/ui/Loading";
import UITextInput from "@/components/ui/TextInput";

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
            //console.log("User signed in", user?.id);
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
    <AuthProvider>
    <View style={styles.container}>
      <UILoading visible={isLoading} />
      <Text style={styles.title}>S'enregistrer</Text>
      <UITextInput
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <UITextInput
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        keyboardType="default"
        autoCapitalize="words"
      />
      <UITextInput
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        keyboardType="default"
        autoCapitalize="words"
      />
      <UITextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      <Text style={styles.registerText} onPress={() => router.push("/login")}>
        Déja un compte ? Connexion
      </Text>
      <UIButton textContent="S'enregistrer" onPress={handleRegister} />
    </View>
    </AuthProvider>
  );
};

export default RegisterScreen;

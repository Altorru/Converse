import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/composables/Auth";
import { useRouter } from "expo-router";
import { supabase } from "@/composables/supabaseClient";
import { useThemeStyles } from "@/composables/useTheme";
import UIButton from "@/components/ui/Button";
import UILoading from "@/components/ui/Loading";
import UITextInput from "@/components/ui/TextInput";

export default function TabTwoScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const styles = useThemeStyles();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata.first_name);
      setLastName(user.user_metadata.last_name);
    }
  }, [user]);

  const handleLogout = () => {
    signOut()
      .then(() => router.replace("/login"))
      .catch((error) => console.error("Error signing out:", error));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });

    if (error) {
      alert('Erreur '+error);
    } else {
      refreshUser()
        .then(() => {alert('Succès: Utilisateur modifié avec succès');})
        .catch((error) => console.error("Error refreshing user:", error));
    }
    setIsLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <UILoading visible={isLoading}/>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Bienvenue dans les paramètres</ThemedText>
        <Text>🎉</Text>
      </View>
      <UITextInput
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />
      <UITextInput
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />
      <UIButton textContent="Enregistrer" onPress={handleSave} />
      <UIButton textContent="Déconnexion" onPress={handleLogout} />
    </ThemedView>
  );
}

const stylesLocal = StyleSheet.create({
  btn: {
    marginBottom: 12,
  },
});

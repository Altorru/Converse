import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/composables/Auth";
import { useRouter } from "expo-router";
import { supabase } from "@/composables/supabaseClient";
import { useThemeStyles } from "@/composables/useTheme";
import UIButton from "@/components/ui/Button";
import UILoading from "@/components/ui/Loading";
import UITextInput from "@/components/ui/TextInput";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar, getAvatarUrl, getCurrentProfileAvatar } from "@/composables/Avatar";

export default function TabTwoScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const styles = useThemeStyles();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      setAvatarUrl(await getCurrentProfileAvatar());
      //console.log("Avatar URL:", avatarUrl);
    };

    if (user) {
      setFirstName(user.user_metadata.first_name);
      setLastName(user.user_metadata.last_name);
      fetchAvatarUrl();
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
      alert("Erreur " + error);
    } else {
      refreshUser()
        .then(() => {
          alert("Succès: Utilisateur modifié avec succès");
        })
        .catch((error) => console.error("Error refreshing user:", error));
    }
    setIsLoading(false);
  };

  const handleAvatarUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIsLoading(true);
      const file = result.assets[0];
      const data = await uploadAvatar(file.uri);
      if (!data) {
        alert("Erreur lors du téléchargement de l'avatar.");
      } else {
        const result = await getAvatarUrl(data.path); // Fetch the full URL of the uploaded avatar
        const url = result?.data?.publicUrl || null;
        setAvatarUrl(url); // Update the avatar URL
        refreshUser();
      }
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <UILoading visible={isLoading} />
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Paramètres</ThemedText>
      </View>
      <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarUpload}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <ThemedText style={styles.avatarPlaceholder}>Ajouter un avatar</ThemedText>
        )}
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    textAlign: "center",
    color: "#fff",
  },
});
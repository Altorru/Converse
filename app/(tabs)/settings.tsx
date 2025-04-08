import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";
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
import {
  uploadAvatar,
  getAvatarUrl,
  getCurrentProfileAvatar,
} from "@/composables/Avatar";

export default function TabTwoScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const styles = useThemeStyles();
  const [firstName, setFirstName] = useState(
    user?.user_metadata?.first_name || ""
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata?.last_name || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      setIsLoading(true);
      const url = await getCurrentProfileAvatar();
      setAvatarUrl(url);
      setIsLoading(false);
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
    try {
      const { error: userError } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName },
      });

      if (userError) {
        alert("Erreur " + userError.message);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user?.id);

      if (profileError) {
        alert("Erreur " + profileError.message);
        return;
      }

      await refreshUser();
      alert("Succès: Utilisateur modifié avec succès");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      // Check if the result contains assets and is not canceled
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsLoading(true);
        const file = result.assets[0]; // Safely access the first asset

        // Upload the avatar
        const data = await uploadAvatar(file.uri);
        if (!data) {
          alert("Erreur lors du téléchargement de l'avatar.");
          setIsLoading(false);
          return;
        }

        // Fetch the full URL of the uploaded avatar
        const avatarResult = await getAvatarUrl(data.path);
        const url = avatarResult?.data?.signedUrl || null;

        if (!url) {
          alert("Erreur lors de la récupération de l'URL de l'avatar.");
          setIsLoading(false);
          return;
        }

        setAvatarUrl(url); // Update the avatar URL
        await refreshUser(); // Refresh user data
      } else {
        console.log("Image selection was canceled or no assets found.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Une erreur est survenue lors du téléchargement de l'avatar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="default"
      />
      <UILoading visible={isLoading} />
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Paramètres</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleAvatarUpload}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <ThemedText style={styles.avatarPlaceholder}>
            Ajouter un avatar
          </ThemedText>
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

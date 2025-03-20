import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/composables/Auth";
import { useRouter } from "expo-router";
import { supabase } from "@/composables/supabaseClient";

export default function TabTwoScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");
  const [errorText, setErrorText] = useState("");

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
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });

    if (error) {
      setErrorText(error.message);
    } else {
      setErrorText("Profile updated successfully!");
      refreshUser()
        .then(() => {})
        .catch((error) => console.error("Error refreshing user:", error));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Welcome to Settings</ThemedText>
        <Text>🎉</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      <View style={styles.btn}>
        <Button title="Save" onPress={handleSave} />
      </View>
      <View style={styles.btn}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  btn: {
    marginBottom: 12,
  },
});

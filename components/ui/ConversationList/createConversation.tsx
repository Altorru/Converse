import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useConversations } from "@/composables/useConversation";
import { useAuth } from "@/composables/Auth";
import { supabase } from "@/composables/supabaseClient";
import { useThemeStyles } from "@/composables/useTheme";

const CreateConversation: React.FC<{ onCancel?: () => void }> = ({
  onCancel,
}) => {
  const { createConversation } = useConversations();
  const { user } = useAuth();
  const [label, setLabel] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<
    { id: string; first_name: string; last_name: string }[]
  >([]);
  const styles = useThemeStyles();
  // 🔄 Fetch all users except the current user
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .neq("id", user?.id);

    if (error) {
      Alert.alert("Error", "Failed to fetch users");
      console.error(error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  // 📌 Handle user selection
  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // ✅ Create conversation
  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert("Error", "Select at least one participant");
      return;
    }

    const participants = [user?.id, ...selectedUsers].filter(
      Boolean
    ) as string[];
    const isGroup = participants.length > 2;

    await createConversation(isGroup ? label : "DM", participants);
    Alert.alert("Success", "Conversation created!");
    handleCancel(); // Reset fields after creation
  };

  // ❌ Cancel and reset
  const handleCancel = () => {
    setLabel("");
    setSelectedUsers([]);
    if (onCancel) onCancel(); // Call the parent-provided onCancel if exists
  };

  return (
    <View>
      <Text style={[styles.title, { marginBottom: 10 }]}>
        Nouvelle conversation
      </Text>

      {/* Input for group name (Only if it's a group chat) */}
      {selectedUsers.length > 1 && (
        <TextInput
          placeholder="Nom du groupe"
          value={label}
          onChangeText={setLabel}
          placeholderTextColor={"lightgrey"}
          style={styles.TextInput}
        />
      )}

      {/* User selection */}
      <Button title="Charger les utilisateurs" onPress={fetchUsers} disabled={loading} />
      {users.map((u) => (
        <Text
          key={u.id}
          onPress={() => toggleUserSelection(u.id)}
          style={{
            padding: 10,
            backgroundColor: selectedUsers.includes(u.id)
              ? "#4CAF50"
              : "#f0f0f0",
            marginVertical: 5,
            borderRadius: 5,
          }}
        >
          {u.first_name} {u.last_name}
        </Text>
      ))}

      {/* Buttons Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button title="Annuler" onPress={handleCancel} color="red" />
        <Button title="Créer" onPress={handleCreateConversation} />
      </View>
    </View>
  );
};

export default CreateConversation;

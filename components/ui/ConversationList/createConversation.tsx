import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useConversations } from "@/composables/useConversation";
import { useAuth } from "@/composables/Auth";
import { supabase } from "@/composables/supabaseClient";

const CreateConversation: React.FC = () => {
  const { createConversation } = useConversations();
  const { user } = useAuth();
  const [label, setLabel] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; firstname: string; lastname: string }[]>([]);

  // 🔄 Fetch all users except the current user
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, firstname, lastname")
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

    const participants = [user?.id, ...selectedUsers].filter(Boolean) as string[];
    const isGroup = participants.length > 2;

    await createConversation(isGroup ? label : "DM", participants);
    Alert.alert("Success", "Conversation created!");
    setLabel("");
    setSelectedUsers([]);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>New Conversation</Text>

      {/* Input for group name (Only if it's a group chat) */}
      {selectedUsers.length > 1 && (
        <TextInput
          placeholder="Enter group name"
          value={label}
          onChangeText={setLabel}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            borderRadius: 5,
            marginBottom: 10,
          }}
        />
      )}

      {/* User selection */}
      <Button title="Load Users" onPress={fetchUsers} disabled={loading} />
      {users.map((u) => (
        <Text
          key={u.id}
          onPress={() => toggleUserSelection(u.id)}
          style={{
            padding: 10,
            backgroundColor: selectedUsers.includes(u.id) ? "#4CAF50" : "#f0f0f0",
            marginVertical: 5,
            borderRadius: 5,
          }}
        >
          {u.firstname} {u.lastname}
        </Text>
      ))}

      {/* Create conversation button */}
      <Button title="Create Conversation" onPress={handleCreateConversation} />
    </View>
  );
};

export default CreateConversation;
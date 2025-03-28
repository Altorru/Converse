import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";

const ConversationScreen: React.FC = () => {
  const { id, label } = useLocalSearchParams<{ id: string; label: string }>();
  const router = useRouter();
  const styles = useThemeStyles();
  
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", sender: "John" },
    { id: "2", text: "Hey!", sender: "You" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: String(messages.length + 1), text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 18, color: "blue" }}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{label}</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ padding: 5, backgroundColor: item.sender === "You" ? "#d1e7ff" : "#f1f1f1", marginBottom: 5, borderRadius: 5 }}>
            <Text style={{ fontWeight: "bold" }}>{item.sender}: </Text>
            {item.text}
          </Text>
        )}
      />

      {/* Message Input */}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          style={[styles.TextInput, { flex: 1, borderWidth: 1, padding: 10, borderRadius: 5 }]}
          placeholder="Type a message..."
          placeholderTextColor={"lightgrey"}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ConversationScreen;
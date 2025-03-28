import React, { useMemo } from "react";
import { View, FlatList, Alert, Text } from "react-native";
import Conversation from "@/components/ui/ConversationList/Conversation";
import { useConversations } from "@/composables/useConversation";
import Loading from "@/components/ui/Loading";

const UIConversation: React.FC = () => {
  const { conversations, loading, deleteConversation } = useConversations();
  
    // 🗑️ Handle long press to delete conversation
    const handleLongPress = async (id: string) => {
      Alert.alert(
        "Supprimer la conversation",
        "Êtes-vous sûr de vouloir supprimer cette conversation ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await deleteConversation(id);
            },
          },
        ]
      );
    };

  return (
    <View style={{ flex: 1, padding: 10, width: "100%", height: "100%" }}>
      {/* Loading Indicator */}
      <Loading visible={loading} />
      {/* List of Conversations */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Conversation
            id={item.id}
            label={item.label}
            lastMessage="Dernier message..." // Replace with real last message
            isDM={item.participants.length === 2}
            avatarUrl={item.avatar_url ?? undefined}
            onPress={() => {
              console.log("Naviguer vers la conversation:", item.id);
            }}
            onLongPress={() => handleLongPress(item.id)}
          />
        )}
      />
    </View>
  );
};

export default UIConversation;
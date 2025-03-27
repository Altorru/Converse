import React from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import Conversation from "@/components/ui/ConversationList/Conversation";
import { useConversations } from "@/composables/useConversation";
import Loading from "@/components/ui/Loading";

const UIConversation: React.FC = () => {
  const { conversations, loading } = useConversations();
  
  return (
    <View>
      <Loading visible={loading} />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Conversation
            label={item.label}
            lastMessage="Dernier message..." // À remplacer par un vrai dernier message
            isDM={item.participants.length === 2}
            avatarUrl={item.avatar_url ?? undefined}
            onPress={() => {
              // Navigation vers la conversation
              console.log("Naviguer vers la conversation:", item.id);
            }}
          />
        )}
      />
    </View>
  );
};

export default UIConversation;
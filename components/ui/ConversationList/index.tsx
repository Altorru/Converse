import React from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import Conversation from "@/components/ui/ConversationList/Conversation";
import { useConversations } from "@/composables/useConversation";

const UIConversation: React.FC = () => {
  const { conversations, loading } = useConversations();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Conversation
            label={item.label}
            lastMessage="Dernier message..." // À remplacer par un vrai dernier message
            isDM={item.participants.length === 2}
            avatarUrl="https://w7.pngwing.com/pngs/566/608/png-transparent-iphone-7-imessage-messages-text-messaging-apple-grass-fruit-nut-mobile-phones-thumbnail.png"
          />
        )}
      />
    </View>
  );
};

export default UIConversation;
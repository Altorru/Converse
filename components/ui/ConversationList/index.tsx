import React from "react";
import { View, FlatList } from "react-native";
import Conversation from "@/components/ui/ConversationList/Conversation";
import { useConversations } from "@/composables/useConversation";
import Loading from "@/components/ui/Loading";
import RoundedCircleButton from "./addConversation";

const UIConversation: React.FC = () => {
  const { conversations, loading } = useConversations();

  return (
    <View style={{ flex: 1, padding: 10, width: "100%", height: "100%" }}>
      {/* Liste des conversations */}
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
              console.log("Naviguer vers la conversation:", item.id);
            }}
          />
        )}
      />

      {/* Bouton d'ajout de conversation */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        <RoundedCircleButton
          onClick={() => console.log("Ajouter une conversation")}
          size={50} // Ajuste la taille selon ton design
        />
      </View>
    </View>
  );
};

export default UIConversation;

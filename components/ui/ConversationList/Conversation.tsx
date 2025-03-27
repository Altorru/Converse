import React from "react";
import { Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { useThemeStyles } from "@/composables/useTheme";
import { useConversations } from "@/composables/useConversation";
import * as Updates from "expo-updates"; // Import for refreshing the app

interface UIConversationProps {
  id: string;
  lastMessage: string;
  label: string;
  isDM?: boolean;
  avatarUrl?: string;
  onPress?: () => void;
}

const UIConversation: React.FC<UIConversationProps> = ({
  id,
  lastMessage,
  label,
  isDM = true,
  avatarUrl,
  onPress,
}) => {
  const styles = useThemeStyles();
  const { deleteConversation, fetchConversations } = useConversations();

  // 🗑️ Handle long press to delete conversation
  const handleLongPress = () => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteConversation(id);
            console.log("Conversation deleted, refreshing list...");
            fetchConversations();
            await Updates.reloadAsync(); // Refresh the app to reflect changes
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.conversationContainer}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <View style={styles.avatarConversation}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarPlaceholder}>Non dispo</Text>
        )}
      </View>
      <View>
        <Text style={styles.conversationContainerLabel}>{label}</Text>
        <Text style={styles.conversationContainerText}>{lastMessage}</Text>
      </View>
      <Text style={styles.conversationContainerText}>
        {isDM ? "MP" : "Groupe"}
      </Text>
    </TouchableOpacity>
  );
};

export default UIConversation;
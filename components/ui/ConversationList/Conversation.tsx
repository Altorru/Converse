import React from "react";
import { Text, ViewStyle, TouchableOpacity, Image } from "react-native";
import { useThemeStyles } from "@/composables/useTheme";
import { View } from "react-native";

interface UIConversationProps {
  lastMessage: string;
  label: string;
  isDM?: boolean;
  avatarUrl?: string;
}

const UIConversation: React.FC<UIConversationProps> = ({
  lastMessage,
  label,
  isDM = true,
  avatarUrl,
}) => {
  const styles = useThemeStyles();
  return (
    <View style={styles.conversationContainer}>
      <TouchableOpacity style={styles.avatarConversation}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarPlaceholder}>Non dispo</Text>
        )}
      </TouchableOpacity>
      <View>
        <Text style={styles.conversationContainerLabel}>{label}</Text>
        <Text style={styles.conversationContainerText}>{lastMessage}</Text>
      </View>
      <Text style={styles.conversationContainerText}>
        {isDM ? "MP" : "Groupe"}
      </Text>
    </View>
  );
};
export default UIConversation;

import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useThemeStyles } from "@/composables/useTheme";

interface UIConversationProps {
  id: string;
  lastMessage: string;
  label: string;
  isDM?: boolean;
  avatarUrl?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

const UIConversation: React.FC<UIConversationProps> = ({
  id,
  lastMessage,
  label,
  isDM = true,
  avatarUrl,
  onPress,
  onLongPress,
}) => {
  const styles = useThemeStyles();

  return (
    <TouchableOpacity
      style={styles.conversationContainer}
      onPress={onPress}
      onLongPress={onLongPress}
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
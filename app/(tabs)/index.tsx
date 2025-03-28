import React, { useState } from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/composables/Auth";
import { useThemeStyles } from "@/composables/useTheme";
import Conversations from "@/components/ui/ConversationList";
import RoundedCircleButton from "@/components/ui/ConversationList/addConversation";
import CreateConversation from "@/components/ui/ConversationList/createConversation";

export default function HomeScreen() {
  const { user } = useAuth();
  const styles = useThemeStyles();

  // State to toggle between Conversations and CreateConversation
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  return (
    <ThemedView style={[styles.container, { padding: 0 }]}>
      <View style={[styles.titleContainer, { margin: 20 }]}>
        <ThemedText style={styles.title}>
          Bienvenue {user ? user.user_metadata.first_name : "Invité"} 🎉
        </ThemedText>
      </View>

      {/* Show Conversations or CreateConversation based on state */}
      {isCreatingConversation ? (
        <CreateConversation
          onCancel={() => setIsCreatingConversation(false)} // Handle cancel action
        />
      ) : (
        <Conversations />
      )}

      {/* Add Conversation Button */}
      {!isCreatingConversation && (
        <View
          style={{
            position: "absolute",
            bottom: 15,
            right: 15,
          }}
        >
          <RoundedCircleButton
            onClick={() => setIsCreatingConversation(true)} // Show CreateConversation
            size={50} // Adjust size as needed
          />
        </View>
      )}
    </ThemedView>
  );
}

import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/composables/Auth";
import { useThemeStyles } from "@/composables/useTheme";
import Conversations from "@/components/ui/ConversationList";
import RoundedCircleButton from "@/components/ui/ConversationList/addConversation";

export default function HomeScreen() {
  const { user } = useAuth();
  const styles = useThemeStyles();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>
          Bienvenue {user ? user.user_metadata.first_name : "Invité"} 🎉
        </ThemedText>
      </View>
      <Conversations></Conversations>
            {/* Bouton d'ajout de conversation */}
            <View
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
        }}
      >
        <RoundedCircleButton
          onClick={() => console.log("Ajouter une conversation")}
          size={50} // Ajuste la taille selon ton design
        />
      </View>
    </ThemedView>
  );
}

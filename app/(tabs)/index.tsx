import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/composables/Auth";
import { useThemeStyles } from "@/composables/useTheme";
import Conversations from "@/components/ui/ConversationList";

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
    </ThemedView>
  );
}

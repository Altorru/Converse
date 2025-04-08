import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";
import { supabase } from "@/composables/supabaseClient";
import { useAuth } from "@/composables/Auth";
import { useConversations } from "@/composables/useConversation";
import MessagesList from "@/components/ui/Messages";

const ConversationScreen: React.FC = () => {
  const { id: conversationId, label } = useLocalSearchParams<{
    id: string;
    label: string;
  }>();
  const router = useRouter();
  const styles = useThemeStyles();

  const [messages, setMessages] = useState<
    { id: string; sender_id: string; text: string; created_at: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0); // Track the current offset for pagination
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Prevent multiple fetches
  const [loading, setLoading] = useState(true); // Track whether the initial data is loading
  const { user } = useAuth();

  const { fetchParticipants, subscribeToMessages } = useConversations();

  const [participants, setParticipants] = useState<any[]>([]);

  // Fetch participants for the conversation
  const fetchConversationParticipants = async () => {
    setParticipants((await fetchParticipants(conversationId)) || []);
  };

  // Fetch messages for the conversation
  const fetchMessages = async (newOffset = 0) => {
    if (!conversationId) {
      console.error("Conversation ID is undefined");
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .range(newOffset, newOffset + 19); // Fetch 20 messages starting from the offset

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    if (data) {
      if (newOffset === 0) {
        // Initial fetch
        setMessages(data.reverse()); // Reverse to maintain chronological order
      } else {
        // Append older messages to the top
        setMessages((prev) => [...data.reverse(), ...prev]);
      }
    }
  };

  // Fetch older messages when scrolling to the top
  const fetchMoreMessages = async () => {
    if (isFetchingMore) return; // Prevent multiple fetches
    setIsFetchingMore(true);

    const newOffset = offset + 20; // Increment the offset by 20
    await fetchMessages(newOffset);
    setOffset(newOffset); // Update the offset
    setIsFetchingMore(false);
  };

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const { data, error } = await supabase.from("messages").insert([
        {
          conversation_id: conversationId,
          sender_id: user?.id,
          text: newMessage,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        fetchMessages(); // Refresh messages after sending
        setNewMessage(""); // Clear input field
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      await fetchMessages(); // Initial fetch
      await fetchConversationParticipants();
      setLoading(false); // Stop loading
    };
    fetchData();

    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]); // Add new message to the list
    });

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup subscription
      }
    };
  }, [conversationId]); // Add conversationId as a dependency

  return (
    <View style={[styles.container, { flex: 1 }]}>
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 10 }}
        >
          <Text style={{ fontSize: 18, color: "gray" }}>{"← Retour"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{label}</Text>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      ) : (
        <MessagesList
          messages={messages}
          user={user}
          participants={participants}
          onFetchMore={fetchMoreMessages} // Pass the fetchMoreMessages function
        />
      )}

      {/* Message Input */}
      {!loading && (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TextInput
            style={[
              styles.TextInput,
              { flex: 1, borderWidth: 1, padding: 10, borderRadius: 5 },
            ]}
            placeholder="Ecrire un message..."
            placeholderTextColor={"lightgrey"}
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Envoyer" onPress={sendMessage} />
        </View>
      )}
    </View>
  );
};

export default ConversationScreen;

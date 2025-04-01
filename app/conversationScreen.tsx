import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemeStyles } from "@/composables/useTheme";
import { supabase } from "@/composables/supabaseClient";
import { useAuth } from "@/composables/Auth";
import { useConversations } from "@/composables/useConversation";

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
  const { user } = useAuth();

  const { fetchParticipants } = useConversations();

  const [participants, setParticipants] = useState<any[]>([]);

  // Fetch participants for the conversation
  const fetchConversationParticipants = async () => {
    setParticipants((await fetchParticipants(conversationId)) || []);
    // console.log(
    //   "Participants for conversation",
    //   conversationId,
    //   "fetched successfully",
    //   participants
    // );
  };

  // Fetch messages for the conversation
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
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
      await fetchMessages();
      await fetchConversationParticipants();
    };

    fetchData();
  }, [conversationId]);

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

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMyMessage = user && item.sender_id === user.id;
          const sender = participants.find((p) => p.id === item.sender_id);

          return (
            <View
              style={{
                flexDirection: isMyMessage ? "row-reverse" : "row", // Align avatar and message
                alignItems: "flex-end",
                marginBottom: 10,
              }}
            >
              {/* Avatar */}
              {!isMyMessage && (
                <View
                  style={{
                    alignItems: "center", // Center the avatar and timestamp
                    marginRight: 10,
                  }}
                >
                  <Image
                    source={
                      sender?.avatar
                        ? { uri: sender.avatar }
                        : undefined // Blank image if no avatar is provided
                    }
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 20,
                      backgroundColor: "#ccc", // Placeholder background
                    }}
                  />
                </View>
              )}

              {/* Message Bubble */}
              <View
                style={{
                  maxWidth: "75%", // Limit the bubble width to 3/4 of the screen
                  padding: 10,
                  backgroundColor: isMyMessage ? "#d1e7ff" : "#f1f1f1", // Different background for "my" messages
                  borderRadius: 20,
                  borderTopRightRadius: isMyMessage ? 0 : 20, // Adjust border radius for "my" messages
                  borderTopLeftRadius: isMyMessage ? 20 : 0,
                  position: "relative", // Allow positioning inside the bubble
                }}
              >
                <Text>{item.text}</Text>

                {/* Timestamp Inside the Bubble */}
                {/* <Text
                  style={{
                    fontSize: 8,
                    color: "gray",
                    position: "absolute",
                    bottom: 0,
                    right: isMyMessage ? 4 : "auto", // Align to bottom-right for "my" messages
                    left: isMyMessage ? "auto" : 4, // Align to bottom-left for others
                  }}
                >
                  {new Date(
                    new Date(item.created_at).getTime() -
                      new Date().getTimezoneOffset() * 60000
                  ).toLocaleString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text> */}
              </View>
            </View>
          );
        }}
      />

      {/* Message Input */}
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
    </View>
  );
};

export default ConversationScreen;

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface MessageBubbleProps {
  text: string;
  createdAt: string;
  isMyMessage: boolean;
  avatarUrl?: string;
  isAdjacentAbove?: boolean; // Whether the bubble is adjacent to the one above
  isAdjacentBelow?: boolean; // Whether the bubble is adjacent to the one below
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  createdAt,
  isMyMessage,
  avatarUrl,
  isAdjacentAbove,
  isAdjacentBelow,
}) => {
  return (
    <View
      style={{
        flexDirection: isMyMessage ? "row-reverse" : "row", // Align avatar and message
        alignItems: "flex-end",
        marginBottom: isAdjacentBelow ? 2 : 10, // Reduce margin if adjacent below
      }}
    >
      {/* Avatar */}
      {!isMyMessage && !isAdjacentBelow && (
        <View style={styles.avatarContainer}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : undefined // Default avatar if none exists
            }
            style={styles.avatar}
          />
        </View>
      )}

      {/* Message Bubble */}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isMyMessage ? "#d1e7ff" : "#f1f1f1", // Different background for "my" messages
            borderTopRightRadius: isMyMessage
              ? isAdjacentAbove
                ? 5
                : 20
              : 20, // Adjust border radius for "my" messages
            borderTopLeftRadius: isMyMessage
              ? 20
              : isAdjacentAbove
              ? 5
              : 20,
            borderBottomRightRadius: isMyMessage
              ? isAdjacentBelow
                ? 5
                : 20
              : 20,
            borderBottomLeftRadius: isMyMessage
              ? 20
              : isAdjacentBelow
              ? 5
              : 20,
            marginLeft: !isMyMessage && isAdjacentBelow ? 35 : 0, // Add margin to align with avatar
          },
        ]}
      >
        <Text>{text}</Text>

        {/* Timestamp Inside the Bubble */}
        {/*<Text
          style={[
            styles.timestamp,
            {
              textAlign: isMyMessage ? "right" : "left", // Align timestamp inside the bubble
            },
          ]}
        >
          {new Date(
            new Date(createdAt).getTime() -
              new Date().getTimezoneOffset() * 60000
          ).toLocaleString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#ccc", // Placeholder background
  },
  bubble: {
    maxWidth: "75%", // Limit the bubble width to 3/4 of the screen
    padding: 10,
    borderRadius: 20,
    position: "relative", // Allow positioning inside the bubble
  },
  timestamp: {
    fontSize: 8,
    color: "gray",
    position: "absolute",
    bottom: 0,
    right: 4,
  },
});

export default MessageBubble;
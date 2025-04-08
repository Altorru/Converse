import React, { useEffect, useRef } from "react";
import { FlatList } from "react-native";
import MessageBubble from "./Bubble";

const MessagesList: React.FC<{
  messages: any[];
  user: any;
  participants: any[];
}> = ({ messages, user, participants }) => {
  const flatListRef = useRef<FlatList<any>>(null); // Create a ref for the FlatList

  // Scroll to the bottom when the component is first loaded
  flatListRef.current?.scrollToEnd({
    animated: false, // No animation on initial load
  });

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true }); // Smooth animation for new messages
    }
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef} // Attach the ref to the FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isMyMessage = user && item.sender_id === user.id;
        const sender = participants.find((p) => p.id === item.sender_id);

        const currentIndex = messages.findIndex((msg) => msg.id === item.id);
        const previousMessage = messages[currentIndex - 1];
        const nextMessage = messages[currentIndex + 1];

        const isAdjacentAbove =
          previousMessage && previousMessage.sender_id === item.sender_id;
        const isAdjacentBelow =
          nextMessage && nextMessage.sender_id === item.sender_id;

        return (
          <MessageBubble
            text={item.text}
            createdAt={item.created_at}
            isMyMessage={isMyMessage}
            avatarUrl={sender?.avatar}
            isAdjacentAbove={isAdjacentAbove}
            isAdjacentBelow={isAdjacentBelow}
          />
        );
      }}
      contentContainerStyle={{ paddingBottom: 10 }} // Add padding at the bottom
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MessagesList;
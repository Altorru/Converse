import React from "react";
import { FlatList } from "react-native";
import MessageBubble from "./Bubble";

const MessagesList: React.FC<{
  messages: any[];
  user: any;
  participants: any[];
}> = ({ messages, user, participants }) => {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isMyMessage = user && item.sender_id === user.id;
        const sender = participants.find((p) => p.id === item.sender_id);

        return (
          <MessageBubble
            text={item.text}
            createdAt={item.created_at}
            isMyMessage={isMyMessage}
            avatarUrl={sender?.avatar}
          />
        );
      }}
    />
  );
};

export default MessagesList;
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MessageBubble from "./Bubble";

const MessagesList: React.FC<{
  messages: any[];
  user: any;
  participants: any[];
  onFetchMore: () => Promise<void>;
}> = ({ messages, user, participants, onFetchMore }) => {
  if (!messages || !user || !participants) return null; // Ensure a valid ReactNode is returned
  const flatListRef = useRef<FlatList<any>>(null);

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // Removed unused getItemLayout function

  const handleScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
    console.warn("Scroll to index failed", info);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });
    }
  };

  // Handle scroll position and loading more when at top
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    //console.log("Scroll event:", contentOffset, layoutMeasurement, contentSize);

    const userAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setIsUserAtBottom(userAtBottom);
    setShowScrollToBottom(!userAtBottom);

    // If user scrolled to top, fetch older messages
    if (contentOffset.y <= 5 && !isFetchingMore) {
      setIsFetchingMore(true);

      onFetchMore().then(() => {
        setIsFetchingMore(false);
      });
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setShowScrollToBottom(false);
  };

  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender || isUserAtBottom) {
      setTimeout(() => {
      if (messages && messages.length > 0) {
        scrollToBottom();
        setIsFirstRender(false);
      }
      }, 50);
    }
  }, [messages]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item, index) => (item.id ? `${item.id}-${index}` : index.toString())} // Ensure unique keys
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
      contentContainerStyle={{ paddingBottom: 10 }}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={
        isFetchingMore ? (
        <ActivityIndicator
          size="small"
          color="#007AFF"
          style={{ marginVertical: 10 }}
        />
        ) : null
      }
      onScrollToIndexFailed={handleScrollToIndexFailed}
      />

      {showScrollToBottom && (
      <TouchableOpacity
        style={styles.scrollToBottomButton}
        onPress={scrollToBottom}
      >
        <Text style={styles.scrollToBottomText}>↓</Text>
      </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollToBottomButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollToBottomText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default MessagesList;
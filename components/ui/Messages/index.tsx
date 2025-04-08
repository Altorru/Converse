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
  ViewToken,
} from "react-native";
import MessageBubble from "./Bubble";

const MessagesList: React.FC<{
  messages: any[];
  user: any;
  participants: any[];
  onFetchMore: () => Promise<void>;
}> = ({ messages, user, participants, onFetchMore }) => {
  const flatListRef = useRef<FlatList<any>>(null);

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [wasAtBottom, setWasAtBottom] = useState(true);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState<number | null>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const first = viewableItems[0];
        if (first.index != null) {
          setFirstVisibleIndex(first.index);
        }
      }
    }
  );

  // Handle scroll position and loading more when at top
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    const isUserAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setWasAtBottom(isUserAtBottom);
    setShowScrollToBottom(!isUserAtBottom);

    // If user scrolled to top, fetch older messages
    if (contentOffset.y <= 5 && !isFetchingMore && firstVisibleIndex !== null) {
      setIsFetchingMore(true);

      const indexBeforeFetch = firstVisibleIndex;

      onFetchMore().then(() => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: indexBeforeFetch + 10, // Adjust if you fetch more or fewer
            animated: false,
            viewPosition: 0,
          });
          setIsFetchingMore(false);
        }, 50); // Let the list layout first
      });
    }
  };

  // Scroll to bottom if user was at bottom before new messages
  const onContentSizeChange = () => {
    if (wasAtBottom && !isFetchingMore) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setShowScrollToBottom(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
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
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={onContentSizeChange}
        ListHeaderComponent={
          isFetchingMore ? (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={{ marginVertical: 10 }}
            />
          ) : null
        }
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
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
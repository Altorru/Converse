import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useColors } from "@/composables/useTheme";

interface UILoadingProps {
  visible: boolean;
}

const UILoading: React.FC<UILoadingProps> = ({ visible }) => {
  const { primary } = useColors();
  return visible ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={primary} />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 1000, // Ensure the loading overlay is on top
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UILoading;

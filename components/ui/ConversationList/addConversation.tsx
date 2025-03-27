import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useColors } from "@/composables/useTheme";

interface RoundedCircleButtonProps {
  onClick: () => void;
  size?: number; // Diameter of the button
  backgroundColor?: string;
  textColor?: string;
}

const RoundedCircleButton: React.FC<RoundedCircleButtonProps> = ({
  onClick,
  size = 50,
  backgroundColor,
  textColor = "#fff",
}) => {
  const colors = useColors(); // Move useColors inside the component

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.primaryDark, // Use colors.text as default
        },
      ]}
    >
      <Text style={{ color: textColor, fontSize: size / 2 }}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RoundedCircleButton;

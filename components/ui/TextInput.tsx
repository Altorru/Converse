import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { useThemeStyles } from "@/composables/useTheme";

interface UITextInputProps {
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "number-pad"
    | "name-phone-pad"
    | "decimal-pad"
    | "twitter"
    | "web-search"
    | undefined;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  onChangeText: (text: string) => void;
}

const UITextInput: React.FC<UITextInputProps> = ({
  onChangeText,
  value,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  secureTextEntry = false,
}) => {
  const styles = useThemeStyles();
  return (
    <TextInput
      style={styles.TextInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      placeholderTextColor={"gray"}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default UITextInput;

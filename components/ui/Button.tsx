import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/composables/useTheme';

interface UIButtonProps {
  textContent: string;
  onPress: () => void;
}

const UIButton: React.FC<UIButtonProps> = ({ textContent, onPress }) => {
  const styles = useThemeStyles();
  return (
    <TouchableOpacity style={styles.Button} onPress={onPress}>
      <Text style={styles.ButtonText}>{textContent}</Text>
    </TouchableOpacity>
  );
};

export default UIButton;

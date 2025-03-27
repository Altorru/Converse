import { useColorScheme, StyleSheet, StatusBarStyle, StatusBar, Appearance } from "react-native";

// Define the color palette
const colors = {
  light: {
    primary: "#6200ee",
    primaryLight: "#9d46ff",
    primaryDark: "#bb86fc",
    secondary: "#b71f75",
    secondaryLight: "#66fff9",
    secondaryDark: "#00a896",
    background: "#ffffff",
    surface: "#ffffff",
    error: "#b00020",
    text: "#000000",
    onPrimary: "#ffffff",
    onSecondary: "#000000",
    onBackground: "#000000",
    onSurface: "#000000",
    onError: "#ffffff",
  },
  dark: {
    primary: "#bb86fc",
    primaryLight: "#efb7ff",
    primaryDark: "#8856c9",
    secondary: "#03dac6",
    secondaryLight: "#66fff9",
    secondaryDark: "#00a896",
    background: "#121212",
    surface: "#121212",
    error: "#cf6679",
    text: "#ffffff",
    onPrimary: "#000000",
    onSecondary: "#000000",
    onBackground: "#ffffff",
    onSurface: "#ffffff",
    onError: "#000000",
  },
};

// Create the useColors hook
export const useColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? colors.light : colors.dark;
};

// Update the useThemeStyles hook to use the colors from useColors
export const useThemeStyles = () => {
  const colorScheme = useColorScheme();
  const themeColors = useColors();

  const stylesGlobal = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginTop: (StatusBar.currentHeight || 20),
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    TextInput: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    errorText: {
      marginBottom: 12,
      textAlign: "center",
    },
    registerText: {
      marginBottom: 12,
      textAlign: "center",
    },
    Button: {
      borderRadius: 8,
      marginBottom: 12,
    },
    avatarContainer: {
      alignSelf: "center",
      marginBottom: 20,
      width: 75,
      height: 75,
      borderRadius: 50,
      borderColor: themeColors.primaryLight,
      borderWidth: 1,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ccc",
    },
    avatar: {
      width: "100%",
      height: "100%",
    },
    avatarPlaceholder: {
      textAlign: "center",
      color: "#fff",
      fontSize: 16,
    },
    avatarConversation: {
      width: 45,
      height: 45,
      borderRadius: 50,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ccc",
    },
    conversationContainer: {
      flexDirection: "row",
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      gap: 10,
    },
    conversationContainerLabel: {
      fontSize: 16,
      fontWeight: "bold",
    },
    conversationContainerText: {
      fontSize: 14,
    },
  });

  const stylesLight = StyleSheet.create({
    container: {
      ...stylesGlobal.container,
      backgroundColor: themeColors.background,
    },
    titleContainer: {
      ...stylesGlobal.titleContainer,
    },
    title: {
      ...stylesGlobal.title,
      color: themeColors.text,
    },
    errorText: {
      ...stylesGlobal.errorText,
      color: themeColors.error,
    },
    registerText: {
      ...stylesGlobal.registerText,
      color: themeColors.secondary,
    },
    TextInput: {
      ...stylesGlobal.TextInput,
      color: themeColors.text,
    },
    Button: {
      ...stylesGlobal.Button,
      padding: 10,
      alignItems: "center",
      backgroundColor: themeColors.primary,
    },
    ButtonText: {
      color: themeColors.onPrimary,
      fontSize: 16,
    },
    avatarContainer: {
      ...stylesGlobal.avatarContainer,
    },
    avatarPlaceholder: {
      ...stylesGlobal.avatarPlaceholder,
    },
    avatar : {
      ...stylesGlobal.avatar,
    },
    statusBar: {
      backgroundColor: colors.light.background,
    },
    avatarConversation: {
      ...stylesGlobal.avatarConversation,
    },
    conversationContainer: {
      ...stylesGlobal.conversationContainer,
      borderColor: themeColors.primaryDark,
    },
    conversationContainerLabel: {
      ...stylesGlobal.conversationContainerLabel,
      color: colors.light.text,
    },
    conversationContainerText: {
      ...stylesGlobal.conversationContainerText,
      color: colors.light.text,
    },
  });

  const stylesDark = StyleSheet.create({
    container: {
      ...stylesGlobal.container,
      backgroundColor: themeColors.background,
    },
    titleContainer: {
      ...stylesGlobal.titleContainer,
    },
    title: {
      ...stylesGlobal.title,
      color: themeColors.text,
    },
    errorText: {
      ...stylesGlobal.errorText,
      color: themeColors.error,
    },
    registerText: {
      ...stylesGlobal.registerText,
      color: themeColors.secondary,
    },
    TextInput: {
      ...stylesGlobal.TextInput,
      color: themeColors.text,
    },
    Button: {
      ...stylesGlobal.Button,
      padding: 10,
      alignItems: "center",
      backgroundColor: themeColors.primary,
    },
    ButtonText: {
      color: themeColors.onPrimary,
      fontSize: 16,
    },
    avatarContainer: {
      ...stylesGlobal.avatarContainer,
    },
    avatarPlaceholder: {
      ...stylesGlobal.avatarPlaceholder,
    },
    avatar : {
      ...stylesGlobal.avatar,
    },
    statusBar: {
      backgroundColor: colors.dark.background,
    },
    avatarConversation: {
      ...stylesGlobal.avatarConversation,
    },
    conversationContainer: {
      ...stylesGlobal.conversationContainer,
      borderColor: themeColors.primaryLight,
    },
    conversationContainerLabel: {
      ...stylesGlobal.conversationContainerLabel,
      color: colors.dark.text,
    },
    conversationContainerText: {
      ...stylesGlobal.conversationContainerText,
      color: colors.dark.text,
    },
  });

  return colorScheme === "light" ? stylesLight : stylesDark;
};

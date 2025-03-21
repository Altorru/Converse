import { useColorScheme, StyleSheet } from "react-native";

const stylesGlobal = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginTop: 30,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
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
});

const stylesLight = StyleSheet.create({
  container: {
    ...stylesGlobal.container,
    backgroundColor: "#fff",
  },
  titleContainer: {
    ...stylesGlobal.titleContainer,
  },
  title: {
    ...stylesGlobal.title,
    color: "#000",
  },
  errorText: {
    ...stylesGlobal.errorText,
    color: "red",
  },
  registerText: {
    ...stylesGlobal.registerText,
    color: "blue",
  },
  TextInput: {
    ...stylesGlobal.TextInput,
    color: "black",
  },
  Button: {
    ...stylesGlobal.Button,
    padding: 10,
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  ButtonText: {
    color: "white",
    fontSize: 16,
  },
});

const stylesDark = StyleSheet.create({
  container: {
    ...stylesGlobal.container,
    backgroundColor: "#000",
  },
  titleContainer: {
    ...stylesGlobal.titleContainer,
  },
  title: {
    ...stylesGlobal.title,
    color: "#fff",
  },
  errorText: {
    ...stylesGlobal.errorText,
    color: "red",
  },
  registerText: {
    ...stylesGlobal.registerText,
    color: "lightblue",
  },
  TextInput: {
    ...stylesGlobal.TextInput,
    color: "white",
  },
  Button: {
    ...stylesGlobal.Button,
    padding: 10,
    alignItems: "center",
    backgroundColor: "blue",
  },
  ButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export const useThemeStyles = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? stylesLight : stylesDark;
};

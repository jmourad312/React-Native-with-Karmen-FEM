import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";

type Props = {
  name?: string;
};

export const ShoppingListItem = ({ name = "Item" }: Props) => {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      `${name} will be gone forever!`,
      [
        {
          text: "YES",
          onPress: () => console.log("Item deleted"),
          style: "destructive",
        },
        {
          text: "Cancel",
          onPress: () => console.log("Item not deleted"),
          style: "cancel",
        },
      ],
    );
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{name}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleDelete}
        activeOpacity={0.5}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomColor: "#1a759f",
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 18, fontWeight: "200" },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

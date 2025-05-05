import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  name?: string;
  isCompleted?: boolean;
};

export const ShoppingListItem = ({
  name = "Item",
  isCompleted = false,
}: Props) => {
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
    <View
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
    >
      <Text
        style={[
          styles.itemText,
          isCompleted ? styles.completedItemText : undefined,
        ]}
      >
        {name}
      </Text>

      <TouchableOpacity onPress={handleDelete} activeOpacity={0.5}>
        <AntDesign
          name={"closecircle"}
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorRed}
        />
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
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
  },
  completedContainer: {
    backgroundColor: theme.colorLightGray,
    borderBottomColor: theme.colorLightGray,
  },
  itemText: { fontSize: 18, fontWeight: "200" },
  completedItemText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGray,
    color: theme.colorGray,
  },
});

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { AntDesign, Entypo } from "@expo/vector-icons";

type Props = {
  name?: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export const ShoppingListItem = ({
  name = "Item",
  isCompleted = false,
  onDelete,
  onToggleComplete,
}: Props) => {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      `${name} will be gone forever!`,
      [
        {
          text: "YES",
          onPress: onDelete,
          style: "destructive",
        },
        {
          text: "Cancel",
          onPress: onDelete,
          style: "cancel",
        },
      ],
    );
  };

  return (
    <Pressable
      onPress={onToggleComplete}
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
    >
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? "check" : "circle"}
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorCerulean}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.itemText,
            isCompleted ? styles.completedItemText : undefined,
          ]}
        >
          {name}
        </Text>
      </View>

      <TouchableOpacity onPress={handleDelete} activeOpacity={0.5}>
        <AntDesign
          name={"closecircle"}
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorRed}
        />
      </TouchableOpacity>

      <StatusBar style="auto" />
    </Pressable>
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
  itemText: { fontSize: 18, fontWeight: "200", flex: 1 },
  completedItemText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGray,
    color: theme.colorGray,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
});

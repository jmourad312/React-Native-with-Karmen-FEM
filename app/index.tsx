import { StyleSheet, TextInput, FlatList, View, Text } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import {getFromStorage, saveToStorage} from "../utils/storage";

const storageKey = "shopping-list";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimeStamp?: number;
  lastUpdatedTimestamp: number;
};

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await getFromStorage(storageKey);
        if (data) {
          setShoppingList(data);
        }
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      }
    };
    fetchInitial();
  }, []);

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    saveToStorage(storageKey, newShoppingList);
    setShoppingList(newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          lastUpdatedTimestamp: Date.now(),
          completedAtTimeStamp: item.completedAtTimeStamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    saveToStorage(storageKey, newShoppingList);
    setShoppingList(newShoppingList);
  };

  const handleSubmit = () => {
    if (inputValue) {
      const newShoppingList = [
        {
          id: new Date().toTimeString(),
          name: inputValue,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ];
      saveToStorage(storageKey, newShoppingList);
      setShoppingList(newShoppingList);
      setInputValue("");
    }
  };

  const orderShoppingList = (shoppingList: ShoppingListItemType[]) => {
    return shoppingList.sort((item1, item2) => {
      if (item1.completedAtTimeStamp && item2.completedAtTimeStamp) {
        return item2.completedAtTimeStamp - item1.completedAtTimeStamp;
      }

      if (item1.completedAtTimeStamp && !item2.completedAtTimeStamp) {
        return 1;
      }

      if (!item1.completedAtTimeStamp && item2.completedAtTimeStamp) {
        return -1;
      }

      if (!item1.completedAtTimeStamp && !item2.completedAtTimeStamp) {
        return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
      }

      return 0;
    });
  };

  return (
    <FlatList
      ListHeaderComponent={
        <TextInput
          placeholder="E.G. Coffee"
          style={styles.textInput}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      }
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your Shopping List Is Empty</Text>
        </View>
      }
      data={orderShoppingList(shoppingList)}
      style={styles.container}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handleDelete(item.id)}
          isCompleted={Boolean(item.completedAtTimeStamp)}
          onToggleComplete={() => handleToggleComplete(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  textInput: {
    borderColor: theme.colorLightGray,
    backgroundColor: theme.colorWhite,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
  },
});

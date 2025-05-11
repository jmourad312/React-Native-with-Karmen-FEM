import { StyleSheet, TextInput, FlatList, View, Text } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted?: boolean;
};

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleSubmit = () => {
    if (inputValue) {
      const newShoppingList = [
        {
          id: new Date().toTimeString(),
          name: inputValue,
        },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setInputValue("");
    }
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
      data={shoppingList}
      style={styles.container}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <ShoppingListItem name={item.name} isCompleted={item.isCompleted} />
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

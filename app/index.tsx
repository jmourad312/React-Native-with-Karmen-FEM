import { StyleSheet, TextInput, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted?: boolean;
};

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Tea", isCompleted: true },
  { id: "3", name: "Nescafe", isCompleted: true },
];

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);

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
    <View style={styles.container}>
      <TextInput
        placeholder="E.G. Coffee"
        style={styles.textInput}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      {shoppingList.map((item) => (
        <ShoppingListItem
          name={item.name}
          isCompleted={item.isCompleted}
          key={item.id}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingTop: 12,
  },
  textInput: {
    borderColor: theme.colorLightGray,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
  },
});

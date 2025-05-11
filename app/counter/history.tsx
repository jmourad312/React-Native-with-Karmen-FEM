import { Text, View, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { countdownStorageKey, PersistedCountdownState } from "./index";
import { getFromStorage } from "../../utils/storage";
import { format } from "date-fns";
import { theme } from "../../theme";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function HistoryScreen() {
  const [countDownState, setCountDownState] =
    useState<PersistedCountdownState>();

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountDownState(value);
    };
    init();
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={countDownState?.completedAtTimeStamps}
      style={styles.list}
      ListEmptyComponent={() => (
        <View style={styles.listEmptyContainer}>
          <Text>No History</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {format(item, fullDateFormat)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  listItem: {
    backgroundColor: theme.colorGray,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 18,
  },
});

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Duration, isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimerSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

// 10 seconds from now (for testing)
const frequency = 10000;

export const countdownStorageKey = "taskly-countdown";

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimeStamps: number[];
};

type CountDownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountDownStatus>({
    isOverdue: false,
    distance: {},
  });

  const lastCompletedAtTimeStamp = countdownState?.completedAtTimeStamps[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeStamp = lastCompletedAtTimeStamp
        ? lastCompletedAtTimeStamp + frequency
        : Date.now();
      if (lastCompletedAtTimeStamp) {
        setIsLoading(false);
      }
      const isOverdue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timeStamp, end: Date.now() }
          : { start: Date.now(), end: timeStamp },
      );

      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedAtTimeStamp]);

  const scheduleNotification = async () => {
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      console.log(result);
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mission Is Due!!",
        },
        trigger: {
          seconds: frequency / 1000,
        },
      });
    } else {
      Alert.alert(
        "Unable to get permission",
        "Please enable notifications in settings",
      );
    }
    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState?.currentNotificationId,
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimeStamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimeStamps]
        : [Date.now()],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>
          Mission Overdue By
        </Text>
      ) : (
        <Text style={styles.heading}>Mission Due In..</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          number={status.distance.weeks ?? 0}
          unit="Weeks"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.days ?? 0}
          unit="Days"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.hours ?? 0}
          unit="Hours"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.minutes ?? 0}
          unit="Minutes"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.seconds ?? 0}
          unit="Seconds"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Mission Complete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },
  activityIndicatorContainer: {
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

import { Text, View } from "react-native";

import type { RouterOutputs } from "@init/api";

type Task = RouterOutputs["task"]["all"][0];

export const Task = (task: Task) => {
  return (
    <View>
      <Text>{task.title}</Text>
      <Text>{task.label}</Text>
      <Text>{task.priority}</Text>
      <Text>{task.status}</Text>
    </View>
  );
};

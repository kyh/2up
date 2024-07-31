import { Text, View } from "react-native";

import type { RouterOutputs } from "@init/api";

type Task = RouterOutputs["task"]["getTaskList"]["data"][0];

export const Task = (task: Task) => {
  return (
    <View className="flex-row justify-between gap-2 border-b p-2">
      <Text>{task.title}</Text>
      <Text>{task.label}</Text>
      <Text>{task.priority}</Text>
      <Text>{task.status}</Text>
    </View>
  );
};

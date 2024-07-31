import { View } from "react-native";

import { api } from "@/trpc/react";
import { Task } from "./task";

type TaskListProps = {
  accountId: string;
};

export const TaskList = ({ accountId }: TaskListProps) => {
  const { data: tasks } = api.task.getTaskList.useQuery({
    accountId,
  });

  return (
    <View className="px-16">
      {tasks?.data.map((task) => <Task key={task.id} {...task} />)}
    </View>
  );
};

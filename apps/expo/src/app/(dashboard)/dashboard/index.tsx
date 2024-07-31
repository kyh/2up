import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { Task } from "@/components/task";
import { api } from "@/trpc/react";

const Dashboard = () => {
  const { data: tasks } = api.task.all.useQuery();

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Dashboard Page" }} />
      {tasks?.map((task) => <Task key={task.id} {...task} />)}
    </SafeAreaView>
  );
};

export default Dashboard;

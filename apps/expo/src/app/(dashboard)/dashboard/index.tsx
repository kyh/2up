import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { TaskList } from "@/components/task-list";
import { api } from "@/trpc/react";

const Dashboard = () => {
  const { data, isLoading } = api.account.userWorkspace.useQuery();

  if (isLoading) {
    return null;
  }

  const accountId = data?.accounts[0]?.id ?? "";

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Dashboard Page" }} />
      <TaskList accountId={accountId} />
    </SafeAreaView>
  );
};

export default Dashboard;

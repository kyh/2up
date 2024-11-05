import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { api } from "@/trpc/react";

const Dashboard = () => {
  const { data: workspace } = api.auth.workspace.useQuery();
  const currentTeam = workspace?.teams.find(
    (t) => t.slug === workspace.defaultTeamSlug,
  );
  const { data: tasks } = api.task.getTasks.useQuery(
    {
      filter: [
        {
          field: "teamId",
          value: currentTeam?.id ?? "",
        },
      ],
    },
    {
      enabled: !!currentTeam,
    },
  );

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Dashboard Page" }} />
      <View className="px-16">
        {tasks?.data.map((task) => (
          <View className="flex-row justify-between gap-2 border-b p-2">
            <Text>{task.title}</Text>
            <Text>{task.label}</Text>
            <Text>{task.priority}</Text>
            <Text>{task.status}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

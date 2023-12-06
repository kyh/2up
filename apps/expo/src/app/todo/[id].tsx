import { SafeAreaView, Text, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";

import { api } from "@/trpc/react";

const Post = () => {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = api.todo.byId.useQuery({ id });

  if (!data) return null;

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="py-4">{data.content}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Post;

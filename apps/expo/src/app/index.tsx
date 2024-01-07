import { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import type { RouterOutputs } from "@acme/api";
import { api } from "@/trpc/react";

const TodoCard = (props: {
  todo: RouterOutputs["todo"]["all"][number];
  onDelete: () => void;
}) => (
  <View className="flex flex-row rounded-lg bg-white/10 p-4">
    <View className="flex-grow">
      <Link
        asChild
        href={{
          pathname: "/todo/[id]",
          params: { id: props.todo.id },
        }}
      >
        <Pressable>
          <Text className="mt-2">{props.todo.content}</Text>
        </Pressable>
      </Link>
    </View>
    <Pressable onPress={props.onDelete}>
      <Text>Delete</Text>
    </Pressable>
  </View>
);

const CreateTodo = () => {
  const utils = api.useUtils();
  const [content, setContent] = useState("");

  const { mutate, error } = api.todo.create.useMutation({
    onSuccess: async () => {
      setContent("");
      await utils.todo.all.invalidate();
    },
  });

  return (
    <View className="mt-4">
      <TextInput
        className="mb-2 rounded bg-white/10 p-2"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={content}
        onChangeText={setContent}
        placeholder="Content"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.content}
        </Text>
      )}
      <Pressable
        className="rounded bg-pink-400 p-2"
        onPress={() => {
          mutate({
            content,
          });
        }}
      >
        <Text className="font-semibold">Add a TODO</Text>
      </Pressable>
      {error?.data?.code === "UNAUTHORIZED" && (
        <Text className="mt-2 text-red-500">
          You need to be logged in to create a todo
        </Text>
      )}
    </View>
  );
};

export default function Index() {
  const utils = api.useUtils();

  const todoQuery = api.todo.all.useQuery();

  const deleteTodoMutation = api.todo.delete.useMutation({
    onSettled: () => utils.todo.all.invalidate(),
  });

  return (
    <SafeAreaView>
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full p-4">
        <Text className="pb-2 text-center text-5xl font-bold">
          App Template
        </Text>

        <Button
          onPress={() => void utils.todo.all.invalidate()}
          title="Refresh todos"
        />

        <View className="py-2">
          <Text className="font-semibold italic">Press on a todo</Text>
        </View>

        <FlashList
          data={todoQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <TodoCard
              todo={p.item}
              onDelete={() => deleteTodoMutation.mutate({ id: p.item.id })}
            />
          )}
        />

        <CreateTodo />
      </View>
    </SafeAreaView>
  );
}

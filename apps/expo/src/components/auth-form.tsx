import { Alert, Button, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import type { SignInWithPasswordInput } from "@init/api/auth/auth-schema";
import { api } from "@/trpc/react";

type AuthFormProps = {
  type: "signin" | "signup";
};

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();

  const signInWithOAuth = api.auth.signInWithOAuth.useMutation({
    onError: (error) => Alert.alert(error.message),
  });
  const signInWithPassword = api.auth.signInWithPassword.useMutation({
    onSuccess: ({ user }) => {
      router.push(`/dashboard/${user.user_metadata.defaultTeam}`);
    },
    onError: (error) => Alert.alert(error.message),
  });
  const signUp = api.auth.signUp.useMutation({
    onSuccess: ({ user }) => {
      router.push(`/dashboard/${user.user_metadata.defaultTeam}`);
    },
    onError: (error) => Alert.alert(error.message),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthWithGithub = () => {
    signInWithOAuth.mutate({
      provider: "github",
    });
  };

  const handleAuthWithPassword = (credentials: SignInWithPasswordInput) => {
    if (type === "signup") {
      signUp.mutate(credentials);
    }
    if (type === "signin") {
      signInWithPassword.mutate(credentials);
    }
  };

  return (
    <View className="grid gap-6">
      <Button title="Continue with Github" onPress={handleAuthWithGithub} />
      <View className="flex items-center justify-center">
        <View className="px-2">
          <Text className="text-xs uppercase text-muted-foreground">Or</Text>
        </View>
      </View>
      <View className="grid gap-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              textContentType="emailAddress"
              className="border px-2"
            />
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="border px-2"
            />
          )}
        />
        <Button
          title={type === "signin" ? "Login" : "Sign Up"}
          color={"#18181b"}
          onPress={form.handleSubmit(handleAuthWithPassword)}
        />
      </View>
    </View>
  );
};

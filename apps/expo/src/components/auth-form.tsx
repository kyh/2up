import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import type { SignInWithPasswordInput } from "@init/api/auth/auth-schema";
import { api } from "@/trpc/react";

type AuthFormProps = {
  type: "signin" | "signup";
};

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const nextPath = "/dashboard";

  const signInWithOAuth = api.auth.signInWithOAuth.useMutation();
  const signInWithPassword = api.auth.signInWithPassword.useMutation({
    onSuccess: () => {
      router.push(nextPath);
    },
  });
  const signUp = api.auth.signUp.useMutation({
    onSuccess: () => {
      router.push(nextPath);
    },
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
      <Pressable onPress={handleAuthWithGithub}>
        <Text>Continue with Github</Text>
      </Pressable>
      <View className="relative">
        <View className="absolute inset-0 flex items-center">
          <View className="w-full border-t" />
        </View>
        <View className="relative flex justify-center text-xs uppercase">
          <View className="bg-background px-2 text-muted-foreground">
            <Text>Or</Text>
          </View>
        </View>
      </View>
      <View>
        <Controller
          name="email"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              textContentType="emailAddress"
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
            />
          )}
        />
        <Pressable onPress={form.handleSubmit(handleAuthWithPassword)}>
          <Text>{type === "signin" ? "Login" : "Sign Up"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

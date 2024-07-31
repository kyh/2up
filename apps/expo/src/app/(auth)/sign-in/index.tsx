import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";

import { AuthForm } from "@/components/auth-form";

const SignIn = () => {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "SignIn Page" }} />
      <View className="container relative grid min-h-dvh flex-col items-center justify-center">
        <View
          className={"mx-auto flex w-full flex-col justify-center space-y-6"}
        >
          <View className="flex flex-col text-center">
            <Text className="text-lg font-light">Welcome back</Text>
          </View>

          <AuthForm type="signin" />

          <View className="px-8 text-center text-sm text-muted-foreground">
            <Text>Don't have an account? </Text>
            <Link href="/auth/sign-up" className="underline">
              <Text>Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";

import { AuthForm } from "@/components/auth-form";

const SignIn = () => {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "SignIn Page" }} />
      <View className="flex justify-center gap-6 p-16">
        <View className="flex items-center">
          <Text className="text-lg font-light">Welcome back</Text>
        </View>

        <AuthForm type="signin" />

        <View className="flex flex-row justify-center">
          <Text className="text-sm text-muted-foreground">
            Don't have an account?{" "}
          </Text>
          <Link href="/auth/sign-up">
            <Text className="text-sm text-muted-foreground underline">
              Sign up
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

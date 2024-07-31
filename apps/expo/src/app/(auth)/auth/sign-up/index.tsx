import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";

import { AuthForm } from "@/components/auth-form";

const SignUp = () => {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "SignUp Page" }} />
      <View className="flex justify-center gap-6 p-16">
        <View className="flex items-center">
          <Text className="text-lg font-light">Create an account</Text>
          <Text className="text-sm text-muted-foreground">
            Please sign up to continue
          </Text>
        </View>

        <AuthForm type="signup" />

        <Text className="px-16 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href="#">
            <Text className="underline underline-offset-4">
              Terms of Service
            </Text>
          </Link>
          <Text> and </Text>
          <Link href="#">
            <Text className="underline underline-offset-4">Privacy Policy</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

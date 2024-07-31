import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { Header } from "@/components/header";

const Index = () => {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home Page" }} />
      <Header />
    </SafeAreaView>
  );
};

export default Index;

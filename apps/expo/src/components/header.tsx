import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

export const Header = () => {
  return (
    <View
      className={
        "flex-row items-center justify-between border-b border-gray-200 p-4"
      }
    >
      <Link asChild href={{ pathname: "/" }}>
        <Pressable>
          <Text className={"font-display inline-flex items-center"}>Init.</Text>
        </Pressable>
      </Link>

      <View className={"ml-auto flex-row items-center text-sm"}>
        <Link asChild href={{ pathname: "/docs" }}>
          <Pressable>
            <Text className={"px-4 py-2 text-muted-foreground"}>
              Documentation
            </Text>
          </Pressable>
        </Link>
        <Link asChild href={{ pathname: "https://github.com/kyh/init" }}>
          <Pressable>
            <Text className={"px-4 py-2 text-muted-foreground"}>Github</Text>
          </Pressable>
        </Link>
        <Link asChild href={{ pathname: "/auth/sign-in" }}>
          <Pressable className="ml-4 h-8 flex-row items-center rounded-full bg-secondary px-5 text-xs text-secondary-foreground shadow-sm hover:bg-secondary/80">
            <Text>Login</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

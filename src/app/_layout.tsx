import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { AuthProvider } from "@/context/auth-context";
import { GoldProvider } from "@/context/gold-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <GoldProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen
            name="beli-emas"
            options={{ animation: "slide_from_right" }}
          />
        </Stack>
      </GoldProvider>
    </AuthProvider>
  );
}

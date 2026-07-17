import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { startGoldPriceTicker } from "@/store/gold-store";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    startGoldPriceTicker();
  }, []);

  return (
    <>
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
    </>
  );
}

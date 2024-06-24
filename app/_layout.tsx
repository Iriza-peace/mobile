import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClientProvider, QueryClient } from "react-query";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ToastProvider } from "react-native-toast-notifications";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider placement="top">
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="post/[id]"
              options={{
                headerTitle: "Post",
              }}
            />
            <Stack.Screen
              name="add"
              options={{
                headerTitle: "Add Post",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

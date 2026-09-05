import { Stack, useRouter, useSegments } from "expo-router"; 
import * as Sentry from '@sentry/react-native';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import "../global.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen'; 
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: 'https://03bd89b0a4bda41f343190d378360739@o4511813997494272.ingest.us.sentry.io/4511847818133504',
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: { type: "react-query-error", queryKey: query?.queryKey?.toString() || "Unknown" }
      });
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, { tags: { type: "react-query-mutation-error" } });
    }
  }),
});

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || !isNavigationReady) return;

    const pathSegments = segments as string[];
    const inAuthGroup = pathSegments.includes('(auth)');
    const inTabsGroup = pathSegments.includes('(tabs)');

    if (isSignedIn) {
      if (inAuthGroup || (!inTabsGroup && pathSegments.length === 0)) {
        router.replace('/(tabs)');
      }
    } else {
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
    }
    setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 150);

  }, [isLoaded, isSignedIn, segments, isNavigationReady]);

  if (!isLoaded || !isNavigationReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="index" options={{ href: null }} /> 
      <Stack.Screen name="oauth-native-callback" />
    </Stack>
  );
}


function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  const paystackPublicKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!;

  if (!publishableKey) throw new Error('Add your Clerk Publishable Key to the .env file');
  if (!paystackPublicKey) throw new Error('Add your Paystack Public Key to the .env file');

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <InitialLayout />
          </QueryClientProvider>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);





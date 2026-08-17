import { Stack } from "expo-router";
import * as Sentry from '@sentry/react-native';
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import "../global.css"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
// 1. Import PaystackProvider from the package
import { PaystackProvider } from 'react-native-paystack-webview'; 

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
        tags: {
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "Unknown"
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey,
        }
      })
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, {
        tags: {
          type: "react-query-mutation-error",
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
        }
      })
    }
  }),
})

export default Sentry.wrap(function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
  // 2. Safely read your Paystack public key from environment variables
  const paystackPublicKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  if (!paystackPublicKey) {
    throw new Error('Add your Paystack Public Key to the .env file')
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        
        {/* 3. Wrap your Stack Navigator with PaystackProvider */}
        <PaystackProvider publicKey={paystackPublicKey}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </PaystackProvider>

      </QueryClientProvider>
    </ClerkProvider>
  )
});


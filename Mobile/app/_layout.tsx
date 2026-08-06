import { Stack } from "expo-router";
import * as Sentry from '@sentry/react-native';
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import "../global.css"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"


Sentry.init({
  dsn: 'https://03bd89b0a4bda41f343190d378360739@o4511813997494272.ingest.us.sentry.io/4511847818133504',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient({
  queryCache:new QueryCache({
    onError:(error:any, query)=>{
     Sentry.captureException(error, {
      tags:{
        type:"react-query-error",
        queryKey:query.queryKey[0]?.toString() || "Unknown"
      },
      extra:{
        errorMessage:error.message,
        statusCode:error.response?.status,
        queryKey:query.queryKey,
      }
     })
    }
  }),
  mutationCache:new MutationCache({
    onError:(error:any)=>{
     Sentry.captureException(error, {
      tags:{
        type:"react-query-mutation-error",
      },
      extra:{
        errorMessage:error.message,
        statusCode:error.response?.status,
      }
     })
    }
  }),
})
 export default Sentry.wrap(function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  return (

    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>

      </QueryClientProvider>
    </ClerkProvider>
  )
});

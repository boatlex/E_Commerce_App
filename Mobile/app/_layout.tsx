import { Stack, useRouter, useSegments } from "expo-router";
import * as Sentry from '@sentry/react-native';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import "../global.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

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
      });
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
      });
    }
  }),
});

// 1. Dedicated navigation wrapper component to safe-guard route switches
function NavigationRoot() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until Clerk confirms authentication initialization state
    if (!isLoaded) return;

    // Check if the route segment the user is on resides in the (auth) directory
    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // Authenticated user trying to access login/signup -> Redirect to dashboard
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      // Unauthenticated user attempting to access private tabs -> Redirect to auth
      router.replace('/(auth)');
    }
  }, [isLoaded, isSignedIn, segments, router]);

  // 2. Halt rendering until Clerk loads. This acts as the buffer that stops the flash.
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 3. Return the clean navigation stacks once user destinations are evaluated
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  const paystackPublicKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!;

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file');
  }

  if (!paystackPublicKey) {
    throw new Error('Add your Paystack Public Key to the .env file');
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <NavigationRoot />
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);




// import { Stack } from "expo-router";
// import * as Sentry from '@sentry/react-native';
// import { ClerkProvider, ClerkLoaded } from '@clerk/expo' // 1. Added ClerkLoaded
// import { tokenCache } from '@clerk/expo/token-cache'
// import "../global.css"
// import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"


// Sentry.init({
//   dsn: 'https://03bd89b0a4bda41f343190d378360739@o4511813997494272.ingest.us.sentry.io/4511847818133504',
//   sendDefaultPii: true,
//   enableLogs: true,
//   replaysSessionSampleRate: 1.0,
//   replaysOnErrorSampleRate: 1,
//   integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
// });

// const queryClient = new QueryClient({
//   queryCache: new QueryCache({
//     onError: (error: any, query) => {
//       Sentry.captureException(error, {
//         tags: {
//           type: "react-query-error",
//           queryKey: query.queryKey[0]?.toString() || "Unknown"
//         },
//         extra: {
//           errorMessage: error.message,
//           statusCode: error.response?.status,
//           queryKey: query.queryKey,
//         }
//       })
//     }
//   }),
//   mutationCache: new MutationCache({
//     onError: (error: any) => {
//       Sentry.captureException(error, {
//         tags: {
//           type: "react-query-mutation-error",
//         },
//         extra: {
//           errorMessage: error.message,
//           statusCode: error.response?.status,
//         }
//       })
//     }
//   }),
// })

// function RootLayout() {
//   const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
//   const paystackPublicKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!

//   if (!publishableKey) {
//     throw new Error('Add your Clerk Publishable Key to the .env file')
//   }

//   if (!paystackPublicKey) {
//     throw new Error('Add your Paystack Public Key to the .env file')
//   }

//   return (
//     <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
//       <ClerkLoaded>
//         <QueryClientProvider client={queryClient}>
          
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="(auth)" />
//               <Stack.Screen name="(tabs)" />
//             </Stack>
          
//         </QueryClientProvider>
//       </ClerkLoaded>
//     </ClerkProvider>
//   )
// }

// export default Sentry.wrap(RootLayout)

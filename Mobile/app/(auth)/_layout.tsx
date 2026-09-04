import { Stack } from "expo-router";

export default function AuthRoutesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
    </Stack>
  );
}

// import { Stack, useRouter } from "expo-router";
// import { useAuth } from '@clerk/expo'; 
// import { useEffect } from "react";
// import { ActivityIndicator, View } from "react-native";

// export default function AuthRoutesLayout() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // ✅ Safely handle navigation side-effects AFTER the component renders
//     if (isLoaded && isSignedIn) {
//       router.replace("/(tabs)");
//     }
//   }, [isLoaded, isSignedIn, router]);

//   // 1. Wait for Clerk to load the auth state
//   if (!isLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // 2. Prevent rendering the auth screens if the user is already signed in 
//   // and waiting for the useEffect redirect to trigger.
//   if (isSignedIn) {
//     return null; 
//   }

//   // 3. Render the auth stack only if the user is completely signed out
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index"/>
//     </Stack>
//   );
// }

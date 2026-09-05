import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@clerk/expo';

export default function OAuthNativeCallback() {
  const { isLoaded } = useAuth();

  // Keep a stable, beautiful loading state mounted.
  // The global root _layout.tsx will automatically detect when Clerk is done 
  // and whisk the user away to /(tabs) or back to /(auth) cleanly!
  return (
    <View className='flex-1 bg-black justify-center items-center'>
      <ActivityIndicator size="large" color="#1DB954" />
    </View>
  );
}

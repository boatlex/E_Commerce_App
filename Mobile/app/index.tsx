import { ActivityIndicator, View } from 'react-native';
import React from 'react';

export default function RootIndex() {
  
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}


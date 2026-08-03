import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import useSocialAuth from '@/hooks/useSocialAuth'
//import {Image} from "expo-router"

const AuthScreen = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth()
   const isAnyLoading = loadingStrategy !== null
  return (
    <View className='flex-1 justify-center items-center bg-white px-10'>
      {/* demo img */}
      <Image source={require('../../assets/images/welcome.png')}
        resizeMode='contain'
        className='size-48'
      />
      <View className='gap-2 mt-3'>
        <TouchableOpacity className='flex-row justify-center items-center
           bg-white rounded-full px-6 border border-grey-300 py-3'
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isAnyLoading}
          style={{
            boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)'
          }}
        >
          {loadingStrategy==="oauth_google"? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className='flex-row items-center justify-center'>
              <Image source={require('../../assets/images/gmail-png.png')}
                resizeMode='contain'
                className='size-10 mr-3'
              />
              <Text className='text-black font-medium text-base mr-2'>Continue With Google</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity className='flex-row justify-center items-center
           bg-white rounded-full px-6 border border-grey-300 py-3'
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isAnyLoading}
          style={{
           boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)'
          }}
        >
          {loadingStrategy==="oauth_apple"? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className='flex-row items-center justify-center'>
              <Image source={require('../../assets/images/apple.png')}
                resizeMode='contain'
                className='size-8 mr-3'
              />
              <Text className='text-black font-medium text-base mr-2'>Continue With Apple</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text className='text-center
       text-gray-500 text-xs leading-4 mt-6 px-2 ' >
        By Signing Up, You Agree to Our <Text className='text-blue-500'>
          Terms
        </Text>{", "}
        <Text className='text-blue-500'>Private Policy</Text> {", and "}
        <Text className='text-blue-500'>Cookie Use</Text>
      </Text>
    </View>
  )
}

export default AuthScreen
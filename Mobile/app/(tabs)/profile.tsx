import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import { useAuth } from '@clerk/expo'
import SafeScreen from '../components/SafeScreen'

const ProfileScreen = () => {

   
 return(
     <SafeScreen>
      <Text className='text-white'>ProfileScreen</Text>
    </SafeScreen>
 )

  
}

export default ProfileScreen
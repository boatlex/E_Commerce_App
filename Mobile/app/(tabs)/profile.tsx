import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Redirect, router, Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { useAuth, useUser } from '@clerk/expo'
import { Image } from "expo-image"
import SafeScreen from '../components/SafeScreen'

const Menu_Items = [
  { id: 1, icon: "person-outline", title: "Edit Profile", color: "#3B82F6", action: "/profile" },
  { id: 2, icon: "list-outline", title: "Order Product", color: "#10B981", action: "/orders" },
  { id: 3, icon: "location-outline", title: "Addresses", color: "#F59E08", action: "/address" },
  { id: 4, icon: "heart-outline", title: "Wish List", color: "#3B82F6", action: "/wishlist" }
] as const

const ProfileScreen = () => {
  const { signOut } = useAuth()
  const { user } = useUser()

  const handleMenuPress = (action: (typeof Menu_Items)[number]['action']) => {
    if (action === "/profile") return
    //router.push(action)
  }

  return (
    <SafeScreen>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}

        <View className='px-6 pb-8'>
          <View className='bg-surface rounded-3xl p-6'>
            <View className='flex-row items-center '>
              <View className='relative'>
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />
                <View
                  className='absolute bg-primary -bottom-1 right-1  border-surface rounded-full border-2
                   items-center justify-center size-7'

                >
                  <Ionicons name='checkmark' size={16} color={"#121212"} />
                </View>
              </View>

              <View className='flex-1 ml-4' >
                <Text className='text-text-primary text-2xl font-bold mb-1'>{user?.lastName}</Text>
                <Text className='text-text-secondary text-sm'>{user?.emailAddresses[0].emailAddress}</Text>

              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}

        <View className='flex-row flex-wrap gap-2 mx-6 mb-3'>
          {Menu_Items.map((item) => (
            <TouchableOpacity
              className='bg-surface rounded-2xl p-6 items-center justify-center'
              key={item.id}
              style={{ width: "48%" }}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.action)}
            >
              <View className='rounded-full h-16 w-16 mb-4 items-center justify-center'
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text className='text-text-primary font-bold text-base'>{item.title}</Text>
            </TouchableOpacity>
          )

          )}
        </View>

        {/* Notifications Link */}

        <View className='mb-3 mx-6 bg-surface rounded-2xl p-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between py-2'
            activeOpacity={0.7}
          >
            <View className='flex-row items-center'>
              <Ionicons name='notifications-outline' size={22} color={"#FFFFFF"} />
              <Text className='text-text-primary font-semibold ml-3'>Notifications</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={"#666"} />
          </TouchableOpacity>
        </View>

        {/* Privacy and Security Link */}

        <View className='mb-3 mx-6 bg-surface rounded-2xl p-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between py-2'
            activeOpacity={0.7}
          //onPress={()=>router.push("/privacy-security")}
          >
            <View className='flex-row items-center'>
              <Ionicons name='shield-checkmark-outline' size={22} color={"#FFFFFF"} />
              <Text className='text-text-primary font-semibold ml-3'>Privacy and Security</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={"#666"} />
          </TouchableOpacity>
        </View>

        {/* Sign Out BTN */}
        <TouchableOpacity
          className='flex-row items-center rounded-xl 
               justify-center py-5 mx-6 mb-3 border-2 border-gray-500/20'
          activeOpacity={0.8}
          onPress={()=>signOut()}
        >
          <Ionicons name='log-out-outline' size={22} color={"#EF4444"} />
          <Text className='text-red-500 font-bold text-base ml-2'>Sign Out</Text>
        </TouchableOpacity>
        <Text className='mb-3 mx-6 text-xm text-text-secondary text-center'>Version 1.0.0</Text>

      </ScrollView>
    </SafeScreen>
  )


}

export default ProfileScreen
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@clerk/expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from "expo-blur"

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()
    const insets = useSafeAreaInsets()

    if (!isLoaded) return null
    if (!isSignedIn) return <Redirect href={"/(auth)"} />

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#1DB954",
            tabBarInactiveTintColor: "#B3B3B3",
            tabBarStyle: {
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.05)", // Soft fallback transparency link
                borderTopWidth: 0,
                height: 55 + insets.bottom,
                paddingTop: 10,
                marginHorizontal: 30, // Reduced from 60 to prevent squishing tab icons
                marginBottom: insets.bottom || 16,
                borderRadius: 24,
                overflow: "hidden",
            },
            // ✅ FIXED: Changed to an implicit arrow return so BlurView actually mounts
            tabBarBackground: () => (
                <BlurView 
                    intensity={80} 
                    tint='dark' 
                    style={StyleSheet.absoluteFill}
                />
            ),
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            }
        }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: "Shop",
                    tabBarIcon: ({ color, size }) => <Ionicons name='grid' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size }) => <Ionicons name='cart' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name='person' size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout

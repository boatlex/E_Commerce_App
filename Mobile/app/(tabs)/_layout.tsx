import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router' 
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@clerk/expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from "expo-blur"

export default function TabsLayout() {
    const { isLoaded } = useAuth()
    const insets = useSafeAreaInsets()

    if (!isLoaded) return null

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#1DB954",
            tabBarInactiveTintColor: "#B3B3B3",
            tabBarStyle: {
                position: "absolute",
                backgroundColor: "rgba(0, 0, 0, 0.7)", 
                borderTopWidth: 0,
                height: 55 + insets.bottom,
                paddingTop: 10,
                marginHorizontal: 30, 
                marginBottom: insets.bottom || 16,
                borderRadius: 24,
                overflow: "hidden",
            },
            tabBarBackground: () => (
                <BlurView 
                    intensity={80} 
                    tint='dark' 
                    style={StyleSheet.absoluteFillObject} 
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
                    tabBarIcon:({ color, size }: { color: string, size: number }) => <Ionicons name='grid' size={size} color={color} />
                }}
            />
            
            <Tabs.Screen
                name='cart'
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size }: { color: string, size: number })=> <Ionicons name='cart' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    tabBarIcon:({ color, size }: { color: string, size: number }) => <Ionicons name='person' size={size} color={color} />
                }}
            />
        </Tabs>
    )
}







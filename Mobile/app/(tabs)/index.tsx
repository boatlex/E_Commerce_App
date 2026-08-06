import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Button } from 'react-native'
import React, { useMemo, useState } from 'react'
import SafeScreen from '../components/SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import ProductsGrid from '../components/ProductsGrid'
import useProducts from '@/hooks/useProducts'
//import { Button } from '@react-navigation/elements'
import * as Sentry from '@sentry/react-native';


const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { results: products, isError, isLoading } = useProducts()


  const CATEGORIES = [
    { name: "All", icon: "grid-outline" as const },
    { name: "Electronics", image: require("../../assets/images/headphone.png") },
    { name: "Machnines", image: require("../../assets/images/headphone.png") },
    { name: "Foods", image: require("../../assets/images/headphone.png") },
    { name: "Fashion", image: require("../../assets/images/Nana-Afia.png") },
    { name: "Furniture", image: require("../../assets/images/headphone.png") },
  ]

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = products
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    return filtered
  }, [products, selectedCategory, searchQuery])

  return (
    <SafeScreen>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}

      >
        {/* Header */}
        <View className='px-6 pb-4 pt-6'>
          <View className='flex-row items-center justify-between mb-6'>
            <View>
              <Text className='text-text-primary 
                 text-3xl font-bold tracking-tight'>Shop</Text>
              <Text className='text-text-secondary text-sm mt-1'>Browse All Products</Text>
            </View>
            <TouchableOpacity className='bg-surface/50 rounded-full' activeOpacity={0.5}>
              <Ionicons name='options-outline' size={22} color={"#fff"} />
            </TouchableOpacity>
          </View>
          {/* Search Bar */}

          <View className='bg-surface flex-row items-center px-5 py-4 rounded-2xl'>
            <Ionicons color={"#666"} size={22} name='search' />
            <TextInput
              placeholder='Search For Products'
              placeholderTextColor={"#666"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className='flex-1 ml-3 text-base text-text-primary'
            />
          </View>
        </View>

        {/* category filter */}
        <View className='mb-6'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name
              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden
                         items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`}
                >
                  {category.icon ? (<><Ionicons name={category.icon} size={36}
                    color={isSelected ? "#121212" : "#fff"} />
                    <Text className={`${isSelected ? "text-text-surface" : "text-text-primary"}`}>{category.name}</Text></>
                  )
                    : (<>
                      <View className='mt-3 mb-2 items-center justify-center'>
                        <Image source={category.image} className='size-12' resizeMode='contain' />
                        <Text className={`max-h-4 ${isSelected ? "text-text-surface" : "text-text-primary"}`}>{category.name}</Text>
                      </View>

                    </>

                    )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View className='px-6 mb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-text-primary text-lg font-bold'>Products</Text>
            <Text className='text-text-secondary text-sm'>{filteredProducts.length}</Text>
          </View>
          {/* Products Grid */}
          <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default ShopScreen
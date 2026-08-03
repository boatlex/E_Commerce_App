import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native'
import React from 'react'
import { Product } from "../../types"
import useWishList from '@/hooks/useWishList'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
//import { Image } from "expo-image"
import useCart from '@/hooks/useCart'

interface ProductsGridProps {
  isLoading: boolean
  isError: boolean
  products: Product[]
}

const ProductsGrid = ({ products, isError, isLoading }: ProductsGridProps) => {
  const { isInWishList, togglleWishList, isAddingToWishList, isRemovingFromWishList } = useWishList()
  const { isAddingToCart, addToCart } = useCart()


  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert(" Success", `${productName} added to cart`)
        },
        onError: (error: any) => {
          Alert.alert("Error", error.response?.data?.error || "Failed to add to cart")
        },
      }
    )
  }


  if (isLoading) {
    return (
      <View className='py-20 items-center justify-center'>
        <ActivityIndicator size={"large"} color={"#00D9FF"} />
        <Text className='text-text-secondary mt-4'>Loading Products...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View className='py-20 items-center justify-center'>
        <Ionicons name='alert-circle-outline' size={48} color={"#FF6B6B"} />
        <Text className='text-text-primary mt-4'> Failed to load products</Text>
        <Text className='text-text-secondary mt-2'> Please Try Aagin Later</Text>
      </View>
    )
  }


  const renderProducts = ({ item: product }: { item: Product }) => {
    const isThisItemLoading = isAddingToWishList === product._id || isRemovingFromWishList === product._id;
    const isAnyItemLoading = isAddingToWishList !== null || isRemovingFromWishList !== null;
    const isAddingThisItem = isAddingToCart === product._id;

    return (
      <TouchableOpacity
        className='bg-surface rounded-3xl overflow-hidden mb-3'
        style={{ width: "48%" }}
        activeOpacity={0.8}
      // onPress={() => router.push(`/products/${product._id}`)}
      >
        <View className='relative'>
          <Image
            // source={product.images?.[0]}
            // contentFit='cover'
            // transition={1000}
            // className='h-44 bg-background-lighter'
            // style={{ width: '100%' }}

            source={{ uri: product.images?.[0] }}
            className='w-full h-44 bg-background-lighter'
            resizeMode='cover'
          />

          <TouchableOpacity
            className='absolute top-3 right-3 bg-black/30 backdrop-blur-xl rounded-full p-2'
            activeOpacity={0.7}
            onPress={() => togglleWishList(product._id)}
            disabled={isAnyItemLoading}
          >
            {isThisItemLoading ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              <Ionicons name={isInWishList(product._id) ? "heart" : "heart-outline"}
                size={18}
                color={isInWishList(product._id) ? "#FF6B6B" : "#FFFFFF"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className='p-4'>
          <Text className='text-text-secondary text-xs mb-1'>{product.category}</Text>
          <Text className='text-text-primary font-bold text-sm mb-2' numberOfLines={2}>
            {product.name}</Text>

          <View className='flex-row items-center mb-2'>
            <Ionicons name='star' size={12} color={"#FFC107"} />
            <Text className='text-text-primary font-semibold ml-1'>
              {product?.averageRating?.toFixed(1)}</Text>
            <Text className='text-text-secondary text-xs ml-1'>{product.totalReviews}</Text>
          </View>

          <View className='flex-row items-center justify-between'>
            <Text className='text-primary text-lg font-bold'>{product?.price ?
              Number(product.price).toFixed(2) : 0.00}</Text>


            <TouchableOpacity
              className=' bg-primary items-center justify-center rounded-full  w-8 h-8'
              activeOpacity={0.7}
              onPress={() => handleAddToCart(product._id, product.name)}
              disabled={isAddingToCart !== null}
            >
              {isAddingThisItem ? (
                <ActivityIndicator size={"small"} color={"#121212"} />
              ) : (
                <Ionicons name="add" size={18} color={"#121212"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )

  }




  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={renderProducts}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={noProductFound}
      scrollEnabled={false}
    />

  )
}

export default ProductsGrid

const noProductFound = () => {

  return (
    <View className='py-20 items-center justify-center'>
      <Ionicons name='search-outline' size={48} color={"#666"} />
      <Text className='mt-4 text-text-primary font-semibold'>No Product Found</Text>
      <Text className='text-text-secondary text-sm mt-2'>Try Adjusting Your Filters</Text>
    </View>
  )
}
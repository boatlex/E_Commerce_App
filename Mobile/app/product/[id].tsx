import { View, Text, Alert, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useProduct } from '@/hooks/useProduct'
import useCart from '@/hooks/useCart'
import useWishList from '@/hooks/useWishList'
import ErrorUi from '../components/ErrorUi'
import LoadingUi from '../components/LoadingUi'
import SafeScreen from '../components/SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'


const { width } = Dimensions.get("window")
const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{id:string}>()

  const { data: product, isError, isLoading } = useProduct(id)
  const { addToCart, isAddingToCart } = useCart()
  const { isInWishList, togglleWishList, isAddingToWishList, isRemovingFromWishList } = useWishList()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)


  if (isLoading) {
    return <LoadingUi />
  }

  if (isError || !product) {
    return <ErrorUi />
  }



  const isThisItemLoading = isAddingToWishList === product._id || isRemovingFromWishList === product._id;
  const isAnyItemLoading = isAddingToWishList !== null || isRemovingFromWishList !== null;
  const isAddingThisItem = isAddingToCart === product._id;
  const inStock = product.stock > 0

  const handleAddToCart = () => {
    addToCart(
      { productId: product._id, quantity },
      {
        onSuccess: () => {
          Alert.alert("Success", `${product.name} added to cart successfully`)
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data.error || "Failed to add to cart")
        }
      }
    )
  }
  console.log(product?._id)
  return (
    <SafeScreen>
      {/* Header */}

      <View className='absolute top-0 right-0 left-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between'>
        <TouchableOpacity className='bg-back/50 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center'
          onPress={() => router.back()}
          activeOpacity={0.7}
        >

          <Ionicons name='arrow-back' size={24} color={"#FFFFFF"} />
        </TouchableOpacity>

        <TouchableOpacity

          className={`w-12 h-12 rounded-full items-center justify-center ${isInWishList(product._id) ? "bg-primary" : "bg-black/50 backdrop-blur-xl"
            }`}
          onPress={() => togglleWishList(product._id)}
          disabled={isAnyItemLoading}
          activeOpacity={0.8}
        >
          {isThisItemLoading ? (
            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
          ) : (
            <Ionicons name={isInWishList(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishList(product._id) ? "#121212" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Galary */}

        <View className='relative'>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width)
              setSelectedImageIndex(index)
            }}
          >
            {product.images.map((image: string, index: number) => (
              <View key={index} style={{ width }}>
                <Image source={image} style={{ width, height: 400 }}
                  contentFit='cover'
                />
              </View>
            ))}
          </ScrollView>

          {/* image indicators */}
          <View className='absolute bottom-4 left-0 right-0 flex-row justify-center gap-2'>
            {product?.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full ${index === selectedImageIndex ? "bg-primary w-6" : "bg-white/50 w-2"
                  }`}
              />
            ))}
          </View>
        </View>

        {/* product info */}
        <View className='p-6'>
          <View className='mb-3 flex-row items-center'>
            <View className='bg-primary/20 px-3 py-1 rounded-full'>
              <Text className='text-primary text-xs font-bold'
              >{product.category}</Text>
            </View>
          </View>

          {/* product name */}
          <Text className='text-text-primary text-3xl font-bold mb-3'>{product.name}</Text>
          {/* rating & Review */}
          <View className='flex-row items-center mb-4'>
            <View className='flex-row items-center bg-surface px-3 py-2 rounded-full'>
              <Ionicons name='star' size={16}color={"#FFC107"}/>
              <Text className='text-text-primary font-bold ml-1 mr-2'>
                {product?.averageRating?.toFixed(1)}</Text>
              <Text className='text-text-secondary text-sm'>
                {product.totalReviews} reviews</Text>
            </View>

            {inStock ?(
              <View className="ml-3 flex-row item-center justify-center">
                 <View className='w-3 h-3 bg-green-500 rounded-full mr-2 mt-1'/>
                 <Text className='text-green-500 font-semibold text-sm'>
                  {product.stock} in stock</Text>
              </View>
            ):( <View className="ml-3 flex-row item-center">
                 <View className='w-2 h-2 bg-red-500 rounded-full mr-2'/>
                 <Text className='text-red-500 font-semibold text-sm'>
                  {product.stock} out of stock</Text>
              </View>)}
          </View>
          {/* price */}
          <View className='flex-row items-center mb-6'>
            <Text className='text-primary text-4xl font-bold'>
              ${product.price?.toFixed(2)}</Text>
          </View>

          {/* quantity */}
          <View className='mb-6'>
             <Text className='text-text-primary text-lg font-bold mb-3'>Quantity</Text>
             <View className='flex-row items-center'>
               <TouchableOpacity
               className='bg-surface rounded-full w-12 h-12 items-center justify-center'
               onPress={()=>setQuantity(Math.max(1, quantity-1))}
               activeOpacity={0.7}
               disabled={!inStock}
               >
                <Ionicons name='remove' size={24} color={inStock ? "#FFFFFF":"#666"}/>
               </TouchableOpacity>
               <Text className='text-text-primary p-4'>{quantity}</Text>

                  <TouchableOpacity
               className='bg-surface rounded-full w-12 h-12 items-center justify-center'
               onPress={()=>setQuantity(Math.min(product.stock, quantity+1))}
               activeOpacity={0.7}
               disabled={!inStock || quantity>=product.stock}
               >
                <Ionicons name='add' size={24} color={ !inStock || quantity>=product.stock ? "#FFFFFF":"#666"}/>
               </TouchableOpacity>
             </View>
             {quantity >=product.stock && (
              <Text className='text-orange-500 text-sm mt-2'>Maximum Stock Reached</Text>
             )}
          </View>
          {/* description */}
          <View className='mb-8'>
            <Text className='text-text-primary text-lg font-bold mb-3'>Description</Text>
            <Text className='text-text-secondary text-base leading-6'>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className='absolute bottom-0 right-0 left-0 bg-background/20
                   backdrop-blur-xl border-t border-surface px-6 py-4 pb-8 mb-8'>
        <View className='flex-row items-center gap-3'>
           <View className='flex-1'>
             <Text className='text-text-secondary text-sm mb-1'>Total Price</Text>
             <Text className='text-text-primary text-2xl font-bold'>
              ${(product?.price * quantity).toFixed(2)}</Text>
           </View>
           <TouchableOpacity 
           className={`rounded-2xl px-8 py-4 flex-row 
            items-center ${!inStock ? "bg-surface":"bg-primary"}`}
            onPress={handleAddToCart}
            activeOpacity={0.8}
            disabled={isAddingThisItem}
           >
             {isAddingThisItem ? (
              <ActivityIndicator size={"small"} color={"#121212"}/>
             ):(
              <>
               <Ionicons name='cart' size={24}color={inStock? "#666":"#121212"}/>
               <Text className={` font-bold text-lg ml-2 ${inStock ? "text-text-secondary":"text-background"}`}>
                {!inStock?"Out of Stock":"Add to Cart"}</Text>
              </>
             
             )}
           </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

export default ProductDetailScreen

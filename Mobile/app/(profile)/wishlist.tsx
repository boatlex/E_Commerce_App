import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import SafeScreen from '../components/SafeScreen'
import useWishList from '@/hooks/useWishList'
import useCart from '@/hooks/useCart'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import ErrorUi from '../components/ErrorUi'
import LoadingUi from '../components/LoadingUi'

const WishListScreen = () => {

  const {
    wishList = [],
    isError,
    isLoading,
    removefromWishListMutation,
    isRemovingFromWishList, refetch } = useWishList()
  const { addToCart, isAddingToCart } = useCart()

  const handleRemoveFromWishlist = (productId: string, productName: string) => {

    Alert.alert("Remove From Wishlist", `Remove ${productName} from wilsh list`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive",
        onPress: () => removefromWishListMutation(productId)
      },

    ])
  }
  const handleAddToCart = (productId: string, productName: string) => {
    addToCart({ productId, quantity: 1 }, {
      onSuccess: () => {
        Alert.alert("Success", `${productName} added to cart`)
      },
      onError: (error: any) => {
        Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart")
      }
    })
  }

  const refetchWishlist = () => {
    refetch()
  }

  if (isError) {
    return (
      <ErrorUi
        title="Wishlist"
        errorMessage="Could not load profile details"
        subMessage="Our servers are down. Please try again later."
        onRetry={refetchWishlist}
      />
    )
  }

  if (isLoading) {
    return (
      <LoadingUi
        title="Wishlist"
        message="Loading Wishlist..."
      />
    )
  }


  return (
    <SafeScreen>
      {/* Header */}

      <View className='px-6 pb-5 pt-2 border-b bg-surface items-center justify-between flex-row'>
        <TouchableOpacity
          className='mr-4'
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={28} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text className='text-text-primary text-2xl font-bold'>WishList</Text>
        <Text className='text-text-primary text-2xl font-bold'>
          {wishList.length}  {wishList.length <= 1 ? "Item" : "Items"}
        </Text>
      </View>
      {wishList.length === 0 ? (
        <View className='flex-1 items-center justify-center px-6'>
          <Ionicons name='heart-outline' size={80} color={"#666"} />
          <Text className='font-semibold text-text-primary text-xl mt-2'>Your Wishlist is empty</Text>
          <Text className=' text-text-secondary text-center mt-4'>
            Start adding products that you love!</Text>
          <TouchableOpacity
            className='bg-primary text-2xl px-8 py-4 mt-4 rounded-2xl'
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className='text-background font-bold text-lg text-center'>
              Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='px-6 py-4'>
            {wishList.map((item) => {

              const isThisItemRemoving = isRemovingFromWishList === item._id
              const isThisItemAdding = isAddingToCart === item._id
              return (
                <TouchableOpacity
                  key={item._id}
                  className='bg-surface rounded-3xl mb-3 overflow-hidden'
                //onPress={()=>router.push(`/products/${item._id}`)}
                >
                  <View className='flex-row p-4'>
                    <Image
                      source={item?.images[0]}
                      className='rounded-2xl bg-background-lighter'
                      style={{ width: 96, height: 96, borderRadius: 8 }}
                    />
                    <View className='flex-1 ml-4'>
                      <Text className='text-text-primary font-bold text-base mb-2' numberOfLines={2}
                      >{item.name}</Text>
                      <Text className='text-primary font-bold text-xl mb-2' numberOfLines={2}
                      >${item?.price?.toFixed(2)}</Text>
                      {item.stock > 0 ? (
                        <View className='flex-row items-center'>
                          <View className='bg-green-500 rounded-full mr-2 w-2 h-2 ' />
                          <Text className='text-green-500 font-semibold text-sm'>
                            {item?.stock} in Stock
                          </Text>
                        </View>
                      ) : (<View className='flex-row items-center'>
                        <View className='bg-red-500 rounded-full mr-2 w-2 h-2 ' />
                        <Text className='text-red-500 font-semibold text-sm'>
                          Out of Stock
                        </Text>
                      </View>)}

                    </View>
                    <TouchableOpacity
                      className='self-start bg-red-500/20 p-2 rounded-full'
                      activeOpacity={0.7}
                      onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                      disabled={isThisItemRemoving}
                    >
                      {isThisItemRemoving ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <Ionicons name='trash-outline' size={20} color={"#EF4444"} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {item.stock > 0 && (
                    <TouchableOpacity
                      className='bg-primary/20 self-start px-6 py-5 items-center mb-3 ml-20 rounded-full'
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isThisItemAdding}
                    >
                      {isThisItemAdding ? (
                        <ActivityIndicator size={"small"} color={"#121212"} />
                      ) : (<Text className='text-primary font-bold text-sm'>+ Add to Cart</Text>)}

                    </TouchableOpacity>
                  )
                  }
                </TouchableOpacity>
              )
            })}

          </View>
        </ScrollView>
      )}
    </SafeScreen>
  )
}

export default WishListScreen
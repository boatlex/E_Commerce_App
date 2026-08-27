import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { useReviews } from '@/hooks/useReviews'
import { Order } from '@/types'
import SafeScreen from '../components/SafeScreen'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import LoadingUi from '../components/LoadingUi'
import ErrorUi from '../components/ErrorUi'
import EmptyUi from '../components/EmptyUi'
import { Image } from 'expo-image'
import { capitalizeFirstLetter, formatDate, getStatusColor } from '@/lib/utils'
import RatingModal from '../components/RatingModal'
import ProductsGrid from '../components/ProductsGrid'

const OrdersScreen = () => {
  const { data: orders, isError, isLoading } = useOrders()
  const { isCreatingReview, createReviewAsync } = useReviews()
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [productRatings, setProductRatings] = useState<{ [key: string]: number }>({})
  const [productComments, setProductComments] = useState<{ [key: string]: string }>({})


  const router = useRouter()

  const handleOpenRating = (order: Order) => {
    setShowRatingModal(true)
    setSelectedOrder(order)


    const initialRatings: { [key: string]: number } = {}
    const initialComments: { [key: string]: string } = {}
    const itemsArray = order?.orderItems || []

    itemsArray.forEach((item) => {
      const productId = item?.product?._id
      if (productId) {
        initialRatings[productId] = 0
        initialComments[productId] = ""
      }
    })
    setProductRatings(initialRatings)
    setProductComments(initialComments)
  }

  const handleSubmitRating = async () => {
    if (!selectedOrder) return

    // Check if all products have been rated
    const allRated = Object.values(productRatings).every((rating) => rating > 0)
    if (!allRated) {
      return Alert.alert("Error", "Please Rate All The Products")
    }

    try {
      const itemsArray = selectedOrder?.orderItems || []

      await Promise.all(
        itemsArray.map((item) => {
          // Get the specific rating for this item from state
          const productId = item?.product?._id

               if (!productId) return Promise.resolve();
          const itemRating = productRatings[productId]
          const itemComment = productComments[productId] || ""

          return createReviewAsync({
             productId: productId,
            orderId: selectedOrder._id,
            rating: itemRating,
            comment: itemComment.trim(),
          })
        })
      )

      Alert.alert("Success", "Thank you for your feedback!")
      setShowRatingModal(false)
      setProductRatings({})
      setProductComments({})
      setSelectedOrder(null)

    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.error || "Failed to submit ratings.")
    }
  }

  // const handleCommentChange =(productId, comment)=>{
  //    setProductComments((prev)=>({...prev, [productId]:comment}))
  // }

  return (
    <SafeScreen>
      {/* Header */}
      <View className='px-6 pb-5 border-b border-surface flex-row items-center'>
        <TouchableOpacity
          className='mr-4'
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={28} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text className='text-text-primary font-bold text-2xl'>Orders</Text>
      </View>

      {isLoading ?
        (<LoadingUi />) :
        isError ? (<ErrorUi />) :
          !orders || orders.length === 0 ?
            (<EmptyUi title='Order'
              emptyMessage='Your do not have any order yet' subMessage='Please pay to see your orders' />) :
            (
              <ScrollView
                className='flex-1'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              >
                <View className='px-6 py-4'>
                  {orders?.map((order) => {
                    const itemsArray = order?.orderItems || []
                    const totalItems = itemsArray.reduce((sum, item) => sum + (item?.quantity || 0), 0)

                    const firstImage = itemsArray[0]?.image || ""

                    return (
                      <View key={order._id} className='bg-surface rounded-3xl p-5 mb-4'>
                        <View className='flex-row mb-4'>
                          <View className='relative'>
                            <Image
                              source={firstImage ? { uri: firstImage } : undefined}
                              style={{ width: 80, height: 80, borderRadius: 8 }}
                              contentFit='cover'
                            />
                            {/* badge */}
                            {itemsArray.length > 1 && (
                              <View className='absolute -bottom-1 -right-1 bg-primary rounded-full
                                  size-7 items-center justify-center'>
                                <Text className='text-background text-sm font-bold'>
                                  +{itemsArray.length - 1}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View className='flex-1 ml-4'>
                            <Text className='text-text-primary font-bold text-base mb-1'>
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </Text>
                            <Text className='text-text-secondary text-sm mb-1'>
                              {formatDate(order.createdAt)}
                            </Text>
                            <View className=' self-start px-3 py-1.5 rounded-full'
                              style={{ backgroundColor: getStatusColor(order.status) + "20" }}>
                              <Text className='text-sm font-bold'
                                style={{ color: getStatusColor(order.status) }}
                              >
                                {capitalizeFirstLetter(order.status)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Order Items Summary */}
                        {itemsArray.map((item, index) => (
                          <Text key={item?._id || index}
                            className='text-text-secondary text-sm flex-1'
                            numberOfLines={1}
                          >
                            {item?.name}       x {item?.quantity}
                          </Text>
                        ))}

                        <View className='border-t border-background-lighter pt-3 flex-row
                             justify-between items-center'>
                          <View>
                            <Text className='text-text-secondary text-xs mb-1'>{totalItems} Items</Text>
                            <Text className='text-text-primary text-xl font-bold'>
                              GH₵{order?.totalPrice?.toFixed(2) || "0.00"}
                            </Text>
                          </View>
                          {order.status === "delivered" && (
                            order.hasReviewed ? (
                              <View className='bg-primary/20 px-5 py-3 rounded-full
                                      flex-row items-center'>
                                <Ionicons name='checkmark-circle' size={18} color={"#1DB954"} />
                                <Text className='text-primary font-bold text-sm ml-2'>Reviewed</Text>
                              </View>
                            ) : (
                              <TouchableOpacity
                                className='bg-primary px-5 py-3 rounded-full flex-row items-center'
                                activeOpacity={0.7}
                                onPress={() => handleOpenRating(order)}
                              >
                                <Ionicons name='star' size={18} color={"#121212"} />
                                <Text className='text-background font-bold text-sm ml-2'>
                                  Leave Rating
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>
            )}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        comments={productComments}       
        handleComment={(productId, comment)=>
             setProductComments((prev)=>({...prev, [productId]:comment}))
        }   
        onSubmit={handleSubmitRating}
        isSubmitting={isCreatingReview}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }

      />
    </SafeScreen>
  )
}

export default OrdersScreen

import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { useReviews } from '@/hooks/useReviews'
import { Order } from '@/types'
import SafeScreen from '../components/SafeScreen'

const OrdersScreen = () => {
  const {data:orders, isError, isLoading}=useOrders()
  const {isCreatingReview, createReviewAsync}=useReviews()
  const [showRatingModal, setShowRatingModal] =useState(false)
  const [selectedOrder, setSelectedOrder] =useState<Order | null>(null)
  const [productRatings, setProductRatings]=useState <{[key:string]:number}>({})


  const handleOpenRating =(order:Order)=>{
     setShowRatingModal(true)
     setSelectedOrder(order)

     // initialise all ratings to zero-resting product rating
     const initialRatings: {[key:string]:number} = {}

     order.orderitems.forEach((item)=>{
      const productId = item.product._id
      initialRatings[productId]=0
     })
     setProductRatings(initialRatings)
  }

   const handleSubmitRating = async()=>{
     if(!selectedOrder) return

     // check if alll products have been rated
     const allRated = Object.values(productRatings).every((rating) => rating > 0)
     if(!allRated){
      Alert.alert("Error","Please Rate All The Products")
     }

     try {
       await Promise.all(
       selectedOrder.orderitems.map((item)=>{
        // Get the specific rating for this item from state
        const itemRating = productRatings[item.product._id] 

        return createReviewAsync({
          productId: item.product._id,
          orderId: selectedOrder._id,
          rating: itemRating // Added the missing property here!
        })
       })
      )
       
      
      Alert.alert("Success", "Thank you for your feedback!")
      setShowRatingModal(false)
      setProductRatings({})
      setSelectedOrder(null)
      
     } catch (error:any) {
        Alert.alert("Error", error.response.data.error ||"Failed to submit ratings.")
     }
   }


  return (
    <SafeScreen>
      <Text>OrdersScreen</Text>
    </SafeScreen>
  )
}

export default OrdersScreen
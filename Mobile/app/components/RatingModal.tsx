import { View, Text, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React from 'react'
import { Order } from '@/types'
import { Ionicons } from '@expo/vector-icons'


interface RatingModalProps{
    visible:boolean
    onClose:()=>void
    order:Order | null
    productRatings:{[key:string]:number}
    onRatingChange:(productId:string, rating:number)=>void
    onSubmit:()=>void
    isSubmitting:boolean
}
const RatingModal = ({
    visible,
    onClose,
    order,
    onSubmit,
    onRatingChange,
    productRatings,
    isSubmitting
}:RatingModalProps) => {

  return (
    <Modal
    visible={visible}
    animationType='fade'
    onRequestClose={onClose}
    transparent={true}
    >
        {/* backdrop layer */}
     <TouchableWithoutFeedback onPress={onClose}>
         <View className='flex-1 bg-background/70 items-center justify-center px-4'>
            <TouchableWithoutFeedback>
                <View className='bg-background rounded-3xl p-6 w-full max-w-md max-h-(80%)'>
                   <View className='items-center mb-4'>
                    <View className='bg-primary/20 rounded-full w-16 h-16 items-center justify-center mb-3'>
                        <Ionicons name='star' size={32} color={"#1DB954"}/>
                    </View>
                    <Text className='text-text-primary text-2xl font-bold mb-1'>
                        Rate Your Products
                    </Text>
                    <Text className='text-text-secondary text-sm text-center'>
                        Rate Each Product From Your Order
                    </Text>
                   </View>
                   <ScrollView>
                    
                   </ScrollView>
                </View>
            </TouchableWithoutFeedback>
         </View>
     </TouchableWithoutFeedback>
    </Modal>
  )
}

export default RatingModal
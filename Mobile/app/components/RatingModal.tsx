import { View, Text, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React from 'react'
import { Order } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'


interface RatingModalProps {
    visible: boolean
    onClose: () => void
    order: Order | null
    productRatings: { [key: string]: number }
    onRatingChange: (productId: string, rating: number) => void
    comments: { [key: string]: string }
    handleComment: (productId: string, comment: string) => void
    onSubmit: () => void
    isSubmitting: boolean


}
const RatingModal = ({
    visible,
    onClose,
    order,
    onSubmit,
    onRatingChange,
    productRatings,
    isSubmitting,
    handleComment,
    comments
}: RatingModalProps) => {

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
                                    <Ionicons name='star' size={32} color={"#1DB954"} />
                                </View>
                                <Text className='text-text-primary text-2xl font-bold mb-1'>
                                    Rate Your Products
                                </Text>
                                <Text className='text-text-secondary text-sm text-center'>
                                    Rate Each Product From Your Order
                                </Text>
                            </View>
                            <ScrollView className='mb-6'>
                                {order?.orderItems.map((item, index) => {

                                    const productId = item.product._id
                                    const currentRating = productRatings[productId] || 0
                                    const currentComment = comments[productId] || ""

                                    return (
                                        <View
                                            key={item._id}
                                            className={`bg-background-lighter rounded-2xl p-4 
                                                ${index < order?.orderItems?.length - 1 ? "mb-3" : ""}`}>
                                            <View className='flex-row items-center mb-3'>
                                                <Image
                                                    source={item.image}
                                                    style={{ width: 64, height: 64, borderRadius: 8 }}
                                                />
                                                <View className='flex-1 ml-3'>
                                                    <Text className='text-text-primary font-semibold text-sm'
                                                        numberOfLines={2}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text className='text-text-secondary text-xm mt-1'>
                                                        Qty: {item.quantity}  GH₵{item?.price?.toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* Rating */}
                                            <View className='flex-row justify-center' >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <TouchableOpacity
                                                        key={star}
                                                        onPress={() => onRatingChange(productId, star)}
                                                        activeOpacity={0.7}
                                                        className='mx-1.5'
                                                    >
                                                        <Ionicons
                                                            name={star <= currentRating ? "star" : "star-outline"}
                                                            size={32}
                                                            color={star <= currentRating ? "#1DB954" : "#666"}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            {/* rating comment */}

                                            <View className='bg-background rounded-xl p-3 border border-surface mt-2'>
                                                <TextInput
                                                    className="text-text-primary text-sm min-h-[70px] max-h-[120px]"
                                                    placeholder="Write your review comments here (optional)..."
                                                    placeholderTextColor="#666666"
                                                    multiline
                                                    maxLength={1000}
                                                    textAlignVertical="top" // Ensures text alignment is consistent across platforms
                                                    value={currentComment || ""}
                                                    onChangeText={(text) => handleComment(productId, text)}
                                                />
                                                <Text className="text-right text-[10px] text-text-secondary mt-1">
                                                    {(currentComment || "").length} / 1000
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                            <View className='gap-3'>
                                <TouchableOpacity
                                    className='bg-primary rounded-2xl py-4 items-center'
                                    activeOpacity={0.8}
                                    onPress={onSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator size={"small"} color={"#121212"} />
                                    ) : (
                                        <Text className='text-background font-bold text-base'>
                                            Submit All Ratings
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className='bg-surface-lighter rounded-2xl py-4 items-center border
                                border-background-lighter'
                                    activeOpacity={0.7}
                                    onPress={onClose}
                                    disabled={isSubmitting}
                                >
                                    <Text className='text-text-secondary font-bold text-base '>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default RatingModal
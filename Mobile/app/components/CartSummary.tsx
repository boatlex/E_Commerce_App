import { View, Text } from 'react-native'
import React from 'react'



interface orderSummaryProps {
    subTotal: number
    shippingFee: number
    tax: number
    total: number
}



const CartSummary = ({ subTotal, shippingFee, tax, total }: orderSummaryProps) => {
    return (
        <View className='px-6 mt-6'>
            <View className='bg-surface rounded-3xl p-5'>
                <Text className='text-text-primary text-xl font-bold mb-4'>Summary</Text>
                <View className='space-y-3'>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-text-secondary text-base'>Subtotal:</Text>
                        <Text className='text-text-primary font-semibold text-base'>
                            {subTotal.toFixed(2)}</Text>
                    </View>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-text-secondary text-base'>Shipping Fee:</Text>
                        <Text className='text-text-primary font-semibold text-base'>
                            {shippingFee.toFixed(2)}</Text>
                    </View>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-text-secondary text-base'>Tax:</Text>
                        <Text className='text-text-primary font-semibold text-base'>
                            {tax.toFixed(2)}</Text>
                    </View>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-text-secondary text-base'>Total Price:</Text>
                        <Text className='text-primary font-semibold text-base'>
                            {total.toFixed(2)}</Text>
                    </View>

                   
                </View>
            </View>
        </View>
    )
}

export default CartSummary
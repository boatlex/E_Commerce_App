import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Address } from '@/types'
import { useAddresses } from '@/hooks/useAddresses'
import { Ionicons } from '@expo/vector-icons'

interface AddressSelectionModalProps {
    visible: boolean
    onClose: () => void
    onProceed: (address: Address) => void
    isProccessing: boolean
}

const AddressSelectionModal = ({ visible, isProccessing, onClose, onProceed }: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] =useState<Address | null>(null)
  const {addresses,isLoading:addressesLoading}=useAddresses()



    return (
        <Modal
        visible={visible}
        animationType='slide'
        onRequestClose={onClose}
        transparent={true}
        >
            <View className='flex-1 bg-black/50 justify-end '>
              <View className='bg-background rounded-t-3xl h-1/2'>
                {/* Modal Header */}
                <View className='flex-row items-center justify-between p-6 border-b border-surface'>
                    <Text className='text-text-primary text-2xl font-bold'>Select Address</Text>
                     <TouchableOpacity
                       className='bg-surface rounded-full p-2'
                       onPress={onClose}
                     >
                      <Ionicons name='close' size={24} color={"#FFFFFF"}/>
                     </TouchableOpacity>
                </View>
                {/* Address Lists */}

                <ScrollView
                 className='flex-1 p-6'
                 showsVerticalScrollIndicator={false}
                 contentContainerStyle={{paddingBottom:100}}
                >
                 
                    {addressesLoading?(
                        <ActivityIndicator size={"large"} color={"#00D9FF"}/>
                    ):(
                        <View className='gap-4'>
                             <Text>You have some addresses</Text>
                        </View>
                    )}
                
                </ScrollView>
              </View>
            </View>
        </Modal>
    )
}

export default AddressSelectionModal
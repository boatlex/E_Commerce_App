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
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const { addresses, isLoading: addressesLoading } = useAddresses()



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
                            <Ionicons name='close' size={24} color={"#FFFFFF"} />
                        </TouchableOpacity>
                    </View>
                    {/* Address Lists */}

                    <ScrollView
                        className='flex-1 p-6'
                    >

                        {addressesLoading ? (
                            <ActivityIndicator size={"large"} color={"#00D9FF"} />
                        ) : (
                            <View className='gap-4'>
                                {addresses?.map((address) => (
                                    <TouchableOpacity
                                        key={address._id}
                                        className={`bg-surface rounded-3xl p-6 border-2 ${selectedAddress?._id === address._id ?
                                            " border-primary" : "bg-background-lighter"
                                            }`}
                                        onPress={() => setSelectedAddress(address)}
                                        activeOpacity={0.7}
                                    >
                                        <View className='flex-row items-start justify-between'>
                                            <View className='flex-1'>
                                                <View className='flex-row items-center mb-3'>
                                                    <Text className='text-primary font-bold text-lg mr-2'
                                                    >{address.label}</Text>
                                                    {address.isDefault && (
                                                        <View className='bg-primary/20 rounded-full px-3 py-1'>
                                                            <Text className='text-primary text-sm font-semibold'>
                                                                Default</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className='text-text-primary font-semibold text-lg mb-2'
                                                >{address.fullName}</Text>
                                                <Text className='text-text-secondary text-base leading-6 mb-2'
                                                >{address.streetAddress}</Text>
                                                <Text className='text-text-secondary text-base mb-2'
                                                >{address.state}, {address.city}, {address.zipCode}</Text>
                                                <Text className='text-text-secondary text-base'
                                                >{address.phoneNumber}</Text>
                                            </View>
                                            {selectedAddress?._id === address._id && (
                                                <View className='bg-primary rounded-full p-2 ml-3'>
                                                    <Ionicons name='checkmark' size={24} color={"#121212"} />
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}

                            </View>
                        )}

                    </ScrollView>

                    <View className=' p-6 border-t border-surface mb-8'>
                        <TouchableOpacity
                            className='bg-primary rounded-2xl py-5'
                            onPress={() => {
                                if (selectedAddress) onProceed(selectedAddress)
                            }}
                            disabled={!selectedAddress || isProccessing}
                        >
                            <View className='flex-row items-center justify-center'>
                                {isProccessing ? (
                                    <ActivityIndicator size={"small"} color={"#121212"}/>
                                ):(
                                    <>
                                    <Text className='text-background font-bold text-lg mr-2'
                                    >Continue to payment</Text>
                                    <Ionicons name='arrow-forward' size={24} color={"#121212"}/>
                                    </>
                                )}
                            </View>

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default AddressSelectionModal
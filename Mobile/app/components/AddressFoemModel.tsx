import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeScreen from './SafeScreen'
import { Ionicons } from '@expo/vector-icons'

interface AddressFormData {
    label: string
    fullName: string
    streetAddress: string
    city: string
    state: string
    zipCode: string
    phoneNumber: string
    isDefault: boolean
}

interface AddressFormModalProps {
    visible: boolean
    isEditing: boolean
    addressForm: AddressFormData
    isAddingAddress: boolean
    isUpdatingAddress: boolean
    onSave: () => void
    onClose: () => void
    onFormChange: (form: AddressFormData) => void
}

const AddressFormModal = ({
    addressForm,
    isAddingAddress,
    isUpdatingAddress,
    onFormChange,
    onClose,
    onSave,
    visible,
    isEditing }: AddressFormModalProps) => {


    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent
            onRequestClose={onClose}
        >

            <KeyboardAvoidingView
             behavior={Platform.OS ==="ios"?"padding":"height"}
             className='flex-1'
            >
            <SafeScreen>
                {/* Header */}
                <View className='px-5 py-5 border-b border-surface flex-row items-center justify-between'>
                    <Text className='text-text-primary text-2xl font-bold'>
                        {isEditing ? "Edit Address" : "Add New Address"}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name='close' size={28} color={"#FFFFFF"} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    className='flex-1'
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className='p-6 '>
                        {/* Label Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>Label</Text>
                            <TextInput
                                className='bg-surface text-text-primary p-4 rounded-2xl text-base'
                                value={addressForm.label}
                                placeholder='e.g., Home, Office, Work'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => onFormChange({ ...addressForm, label: text })}
                            />
                        </View>

                        {/* Name Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>Full Name</Text>
                            <TextInput
                                className='bg-surface text-text-primary px-4 py-4 rounded-2xl text-base'
                                value={addressForm.fullName}
                                placeholder='Enter Your Full Name'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
                            />
                        </View>

                        {/* Street Address Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>Street Address</Text>
                            <TextInput
                                className='bg-surface text-text-primary px-4 py-4 rounded-2xl text-base'
                                value={addressForm.streetAddress}
                                placeholder='Street Address apt/suite number'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
                                multiline
                            />
                        </View>

                        {/* City Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>City</Text>
                            <TextInput
                                className='bg-surface text-text-primary px-4 py-4 rounded-2xl text-base'
                                value={addressForm.city}
                                placeholder='e.g., Kumasi, Abidjan, Lagos'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
                            />
                        </View>

                        {/* State Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>State/Region</Text>
                            <TextInput
                                className='bg-surface text-text-primary px-4 py-4 rounded-2xl text-base'
                                value={addressForm.state}
                                placeholder='e.g., Ashanti, Greater-Accra, Northern'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => onFormChange({ ...addressForm, state: text })}
                            />
                        </View>

                        {/* ZipCode Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>Zip Code</Text>
                            <TextInput
                                className='bg-surface text-text-primary px-4 py-4 rounded-2xl text-base'
                                value={addressForm.zipCode} // ✅ Hooked to local string state
                                placeholder='e.g., 0000'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => onFormChange({ ...addressForm, zipCode: text })}
                                keyboardType='number-pad'
                            />
                        </View>

                        {/* Phone number Input */}
                        <View className='mb-5'>
                            <Text className='text-text-primary font-semibold mb-2'>Phone Number</Text>
                            <TextInput
                                className='bg-surface text-text-primary px-4 py-4 rounded-2xl text-base'
                                value={addressForm.phoneNumber}
                                placeholder='e.g., 02010001000'
                                placeholderTextColor={"#666"}
                                onChangeText={(text) => {onFormChange({ ...addressForm, phoneNumber: text })
                                }}
                                keyboardType='phone-pad'
                            />
                        </View>

                        {/* Default Address Input */}
                        <View className='bg-surface p-4 rounded-2xl flex-row items-center justify-between mb-6'>
                            <Text className='text-text-primary font-semibold'>Set as default address</Text>
                            <Switch
                                value={addressForm.isDefault}
                                onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
                                thumbColor={"#fff"} 
                            />
                        </View>

                        {/* Save BTN */}
                        <TouchableOpacity
                            className='bg-primary rounded-2xl py-5 items-center'
                            activeOpacity={0.7}
                            onPress={onSave}
                            disabled={isAddingAddress || isUpdatingAddress}
                        >
                            {isAddingAddress || isUpdatingAddress ? (
                                <ActivityIndicator size={"small"} color={"#121212"}/>
                            ) : (
                                <Text className='text-background font-bold text-lg'>Save Address</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
             </SafeScreen>
             </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddressFormModal;

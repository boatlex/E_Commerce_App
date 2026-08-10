import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useAddresses } from '@/hooks/useAddresses'
import ErrorUi from '../components/ErrorUi'
import LoadingUi from '../components/LoadingUi'
import SafeScreen from '../components/SafeScreen'
import Header from '../components/Header'
import { Ionicons } from '@expo/vector-icons'
import { Address } from '@/types'
import AddressFormModal from '../components/AddressFormModal'
import AddressCard from '../components/AddressCard'

const AddressesScreen = () => {

  const {
    addAddress, isError, isLoading, refetch,
    addresses, updateAddress, deleteAddress,
    isAddingAddress, isUpdatingAddress, isDeletingingAddress
  } = useAddresses()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [edittingAddressId, setEdittingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false
  })

  const reFetchAddresses = () => { refetch() }

  const handleAddAddress = () => {

    setShowAddressForm(true)
    setEdittingAddressId(null)
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false
    })

  }

  const handleEditAddress = (address: Address) => {
   
    setShowAddressForm(true)
    setEdittingAddressId(address._id)
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode ? String(address.zipCode) : "",
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault
    })
  }

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert(" Delete Address", `Are you sure you want to delete this ${label}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => deleteAddress(addressId)
      }
    ])
  }

  const handleSaveteAddress = () => {

    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode ||
      !addressForm.phoneNumber 
      
    ){Alert.alert("Error","Please fill in all fields ")
       return }

       if(edittingAddressId){
          updateAddress(
            {
            addressId:edittingAddressId,
            addressData:addressForm
          },
          {
            onSuccess:()=>{
              setShowAddressForm(false)
               setEdittingAddressId(null),
             Alert.alert("Success", "Address updated successfully")
            },
            
           onError:(error:any)=>{
             Alert.alert("Error",error?.response?.data?.error ||"Failed to update address")
           }
          
          },
          )
       }else{
         addAddress(addressForm, {
          onSuccess:()=>{
              setShowAddressForm(false)
             Alert.alert("Success", "Address added successfully")
            },

             onError:(error:any)=>{
             Alert.alert("Error",error?.response?.data?.error ||"Failed to add address")
           }
         })
       }

   }

  const handleCloseAddressForm = () => {
    setShowAddressForm(false)
    setEdittingAddressId(null)
   }

  if (isError) {
    return (
      <ErrorUi
        title='My Addresses'
        errorMessage='Failed to load addresses'
        subMessage='Please check your connection and try again'
        onRetry={reFetchAddresses}
      />
    )
  }

  if (isLoading) {
    return (
      <LoadingUi
        title='My Addresses'
        message='Loading Addresses...'
      />
    )
  }

  return (
    <SafeScreen>
      <Header title='My  Address' />

      {addresses.length === 0 ? (
        <View className='flex-1 items-center justify-center px-6'>
          <Ionicons name='location-outline' size={80} color={"#666"} />
          <Text
            className='text-text-primary font-semibold text-xl mt-4'
          >No Address Yet</Text>
          <Text
            className='text-text-secondary text-center mt-2'
          >Add Your First Delivery Address</Text>
          <TouchableOpacity
            className='bg-primary rounded-2xl px-8 py-4 mt-6'
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className='text-background font-b text-base'>+Add Address</Text>
          </TouchableOpacity>
        </View>

      ) : (
         <ScrollView 
           className='flex-1'
           contentContainerStyle={{paddingBottom:100}}
           showsVerticalScrollIndicator={false}
         >
         <View className='px-6 py-4'>
          {addresses.map((address)=>{

            return(
                 <AddressCard
             key={address._id}
             address={address}
             onEdit={handleEditAddress}
             onDelete={handleDeleteAddress}
             isUpdatingAddress={isUpdatingAddress}
             isDeletingAddress={isDeletingingAddress}
            />
            )
          })}
           
           <TouchableOpacity
             className='bg-primary rounded-2xl py-4 items-center mt2'
             activeOpacity={0.8}
             onPress={handleAddAddress}
           >
           <View className='flex-row items-center'>
            <Ionicons name='add-circle-outline' size={24} color={"#121212"}/>
             <Text
              className='text-background font-bold text-base ml-2'
             >Add Address</Text>
           </View>
           </TouchableOpacity>
         </View>
         </ScrollView>
      )}

      <AddressFormModal
       visible={showAddressForm}
       isEditing={!!edittingAddressId}
       addressForm={addressForm}
       isAddingAddress={isAddingAddress}
       isUpdatingAddress={isUpdatingAddress}
       onClose={handleCloseAddressForm}
       onSave={handleSaveteAddress}
       onFormChange={(updatedData)=>{
        setAddressForm((prev)=>({...prev , ...updatedData}))
       }}
      />
    </SafeScreen>
  )
}

export default AddressesScreen
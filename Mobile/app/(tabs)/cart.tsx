import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '../components/SafeScreen'
import { WebView } from "react-native-webview"
import useCart from '@/hooks/useCart'
import { useAddresses } from '@/hooks/useAddresses'
import { useApi } from '@/lib/api'
import { Address } from '@/types'
import ErrorUi from '../components/ErrorUi'
import LoadingUi from '../components/LoadingUi'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import CartSummary from '../components/CartSummary'
import AddressSelectionModal from '../components/AddressSelectionModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyUi from '../components/EmptyUi'

const CartScreen = () => {
  const api = useApi()
  const {
    cart,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemovingFromCart,
    isUpdatingQuantity,
    removeFromCart,
    updateQuantity,
    addToCart,
    cartItemCount,
    isAddingToCart,
    isClearingCart
  } = useCart()
  const { addresses } = useAddresses()

  const [paymentLoading, setPaymentLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [addressModalVisible, setAddressModalVisible] = useState(false)

  const cartItems = cart?.items || []
  const subTotal = cartTotal
  const shippingFee = 10.0
  const tax = subTotal * 0.08
  const total = subTotal + shippingFee + tax

  const handleQuantityChange = (productId: string, currentQty: number, change: number) => {
    const newQuantity = currentQty + change
    if (newQuantity < 1) return
    updateQuantity({ productId, quantity: newQuantity })
  }

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeFromCart(productId) }
    ])
  }

  const handleChekout = () => {
    if (cartItems.length === 0) return
    if (!addresses || addresses.length === 0) {
      Alert.alert("No Address", "Please provide shipping address before checking out", [{ text: "Ok" }])
      return
    }
    setAddressModalVisible(true)
  }



 const handleProceedWithPayment = async (selectedAddress: Address) => {
  setAddressModalVisible(false)
  try {
    setPaymentLoading(true)
    const itemsToSend = cartItems.length > 0 ? cartItems : (cart?.items || []);
    const response = await api.post("/payment/initialized", {
      cartItems: itemsToSend, 
      shippingAddress: {
        fullName: selectedAddress.fullName,
        streetAddress: selectedAddress.streetAddress,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: Number(selectedAddress.zipCode), 
        phoneNumber: Number(selectedAddress.phoneNumber), 
      }
    })
    
    if (response.data?.status) {
      setCheckoutUrl(response.data.data.authorization_url);
    } else {
      Alert.alert("Error", "Payment initialization structure missing status flag");
    }

  } catch (error: any) {
    
    if (error.response) {
      console.log("❌ Server Error Payload Data:", error.response.data)
      Alert.alert("Checkout Error", error.response.data.message || "Failed to Initialize Payment");
    } else {
      console.log("❌ Connection Error Message:", error.message);
      Alert.alert("Error", "Network connectivity failure");
    }
  } finally {
    setPaymentLoading(false)
  }
}



  const handleWebViewStateChange = (navState: any) => {
    const { url } = navState;
    if (url.includes('payment-success') || url.includes('checkout/thankyou') || url.includes('callback')) {
      setCheckoutUrl(null);
      clearCart();
      Alert.alert('Success!', 'Payment verified! Processing your order.');
    }
    if (url.includes('cancel') || url.includes('close')) {
      setCheckoutUrl(null);
      Alert.alert('Payment Cancelled', 'You aborted the transactional loop.');
    }
  };

  if (isError) return <ErrorUi />
  if (isLoading) return <LoadingUi />
  if (cartItems.length === 0) return <EmptyUi title='Cart' subMessage='Your Cart is Empty' emptyMessage='Add some products to get started' />

  return (
    <SafeScreen>
      <Text className='px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight'>Cart</Text>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 240 }}>
        <View className='px-6 space-y-4'>
          {cartItems.map((item) => {
            const isThisItemUpdating = isUpdatingQuantity?.productId === item.product._id;
            const isThisMinusUpdating = isThisItemUpdating && isUpdatingQuantity.quantity < item.quantity;
            const isThisPlusUpdating = isThisItemUpdating && isUpdatingQuantity.quantity > item.quantity;
            const isThisItemRemoving = isRemovingFromCart === item.product._id;

            return (
              <View key={item._id} className='bg-surface rounded-2xl text-3xl overflow-hidden mb-3'>
                <View className='p-4 flex-row'>
                  <View className='relative'>
                    <Image
                      source={item?.product?.images?.[0] || ""}
                      className='rounded-2xl bg-background-lighter'
                      style={{ width: 122, height: 112, borderRadius: 16 }}
                      contentFit='cover'
                    />
                    <View className='absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5'>
                      <Text className='text-background text-sm font-bold'>{item.quantity}</Text>
                    </View>
                  </View>

                  <View className='flex-1 ml-4 justify-between'>
                    <View>
                      <Text className='text-text-primary font-bold text-lg leading-tight'>{item.product.name}</Text>
                      <View className='flex-row items-center mt-2 gap-6'>
                        <Text className='text-primary font-bold text-2xl'>{(item.product.price * item.quantity).toFixed(2)}</Text>
                        <Text className='text-text-secondary text-sm ml-2'>{item.product.price?.toFixed(2)} each</Text>
                      </View>
                    </View>

                    <View className='flex-row items-center mt-3 justify-between'>
                      <View className='flex-row '>
                        <TouchableOpacity
                          className='bg-primary/20 rounded-full w-9 h-9 items-center justify-center'
                          activeOpacity={0.7}
                          onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                          disabled={isThisItemUpdating || isThisItemRemoving}
                        >
                          {isThisMinusUpdating ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name='remove' size={18} color="#FFFFFF" />}
                        </TouchableOpacity>

                        <View className='mx-3 min-w-[32px] items-center'>
                          <Text className='text-text-primary font-bold text-lg'>{item.quantity}</Text>
                        </View>

                        <TouchableOpacity
                          className='bg-primary/20 rounded-full w-9 h-9 items-center justify-center'
                          activeOpacity={0.7}
                          onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                          disabled={isThisItemUpdating || isThisItemRemoving}
                        >
                          {isThisPlusUpdating ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name='add' size={18} color="#FFFFFF" />}
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity onPress={() => handleRemoveItem(item.product._id, item.product.name)} disabled={isThisItemRemoving}>
                        {isThisItemRemoving ? <ActivityIndicator size="small" color="#FF3B30" /> : <Ionicons name="trash-outline" size={22} color="#FF3B30" />}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <CartSummary
          subTotal={subTotal}
          shippingFee={shippingFee}
          tax={tax}
          total={total}
        />


        <AddressSelectionModal
          visible={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
          onProceed={handleProceedWithPayment}
          isProccessing={paymentLoading}
        />
      </ScrollView>


      <View className='absolute bottom-0 right-0 left-0
       bg-background backdrop-blur-xl border-t border-surface pt-4 pb-32 px-6'>
        {/* quick start */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center'>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            <Text className='text-text-secondary ml-2'>
              {cartItemCount} {cartItemCount === 1 ? "Item" : "Items"}</Text>
          </View>
          <View className='flex-row items-center'>
            <Text className='text-text-primary font-bold text-xl'>
              {total?.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout BTN */}
        <TouchableOpacity
         className='bg-primary rounded-2xl overflow-hidden mb-10'
         activeOpacity={0.8}
          onPress={handleChekout}
          disabled={paymentLoading}
        >
           <View className='py-5 flex-row items-center justify-center'>
            {paymentLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text className="text-background font-bold text-lg mr-2">Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
           </View>
        </TouchableOpacity>
      </View>


      
<Modal
  visible={!!checkoutUrl}
  animationType="slide"
  onRequestClose={() => {
    Alert.alert("Cancel Payment", "Are you sure you want to exit checkout?", [
      { text: "Stay", style: "cancel" },
      { text: "Exit", style: "destructive", onPress: () => setCheckoutUrl(null) }
    ]);
  }} 
>
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <View className='flex-row items-center p-4 border-b border-gray-100'>
      <TouchableOpacity onPress={() => setCheckoutUrl(null)} style={{ padding: 4 }}>
        <Ionicons name="close" size={26} color="#000" />
      </TouchableOpacity>
       <Text className="text-lg font-bold text-black ml-4">
        Paystack Payment
      </Text>
    </View>

    {checkoutUrl && (
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleWebViewStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Mobile Safari/537.36"
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-surface">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        )}
      />
    )}
  </SafeAreaView>
</Modal>


    </SafeScreen>
  )
}




export default CartScreen

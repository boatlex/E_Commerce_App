import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '../components/SafeScreen'
import { WebView } from "react-native-webview"
import useCart from '@/hooks/useCart'
import { useAddresses } from '@/hooks/useAddresses'
import { useApi } from '@/lib/api'

const CartScreen = () => {
  const api = useApi()
  const {
    addToCart,
    isAddingToCart,
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isClearingCart,
    isError,
    isLoading,
    isRemovingFromCart,
    isUpdatingQuantity,
    removeFromCart,
    updateQuantity,
  } = useCart()
  const { addresses, } = useAddresses()

  const [paymentLoading, setPaymentLoading] = useState(false)
  const [checoutUrl, setCheckoutUrl] = useState(null)
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
    Alert.alert("Remove Item", ` Remove ${productName} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive",
        onPress: () => removeFromCart(productId)
      }
    ])
  }

  const handleChekout = () => {
    if (cartItems.length === 0) return

    if (!addresses || addresses.length === 0) {
      Alert.alert("No Address", "Please provide shipping address before checking out",
        [{ text: "Ok" }])
      return
    }

    setAddressModalVisible(true)
  }


  // const startPayment = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.post(BACKEND_URL, {
  //         email: 'user@example.com',
  //         amount: 50, // Value in GHS or NGN
  //       });

  //       if (response.data.status) {
  //         setCheckoutUrl(response.data.data.authorization_url);
  //       }
  //     } catch (error) {
  //       console.error('Payment initialization failed', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Monitor WebView navigation to detect completion or cancellation
  //   const handleWebViewStateChange = (navState) => {
  //     const { url } = navState;

  //     if (url.includes('payment-success') || url.includes('checkout/thankyou')) {
  //       setCheckoutUrl(null);
  //       alert('Payment initialization finished! Processing your order.');
  //     }
  //   };

  //   if (loading) {
  //     return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  //   }

  //   if (checkoutUrl) {
  //     return (
  //       <SafeAreaView style={styles.container}>
  //         <WebView 
  //           source={{ uri: checkoutUrl }} 
  //           onNavigationStateChange={handleWebViewStateChange}
  //           javaScriptEnabled={true}
  //           domStorageEnabled={true}
  //         />
  //       </SafeAreaView>
  //     );
  //   }

  //   return (
  //     <View style={styles.center}>
  //       <Button title="Pay Now" onPress={startPayment} />
  //     </View>
  //   );
  // }

  return (
    <SafeScreen>
      <Text className='text-white'>CartScreen</Text>
    </SafeScreen>
  )
}

export default CartScreen


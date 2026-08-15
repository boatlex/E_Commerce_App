import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/lib/api'
import { Cart } from '@/types'

const useCart = () => {


   const queryClient = useQueryClient()

   const api = useApi()

   const { data: cart, isError, isLoading } = useQuery({
      queryKey: ['cart'],
      queryFn: async () => {
         const { data } = await api.get<{ cart: Cart }>("/cart")
         return data.cart
      }
   })


   const addToCartMutation = useMutation({
      mutationFn: async ({ productId, quantity = 1 }: { productId: string, quantity?: number }) => {
         const { data } = await api.post<{ cart: Cart }>("/carts", { productId, quantity })
         return data.cart
      },

      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['cart'] })
      },

   })
   const updateCartQuantityMutation = useMutation({
      mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
         const { data } = await api.put<{ cart: Cart }>(`/carts/${productId}`, { quantity })
         return data.cart
      },

      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['cart'] })
      },

   })
   const removeFromCartMutation = useMutation({
      mutationFn: async (productId: string) => {
         const { data } = await api.delete<{ cart: Cart }>(`/carts/${productId}` )
         return data.cart
      },

      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['cart'] })
      },

   })
   const clearCartMutation = useMutation({
      mutationFn: async () => {
         const { data } = await api.delete<{ cart: Cart }>("/carts" )
         return data.cart
      },

      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['cart'] })
      },

   })

   const cartTotal = cart?.items.reduce((sum, item)=> 
      sum + item.product.price * item.quantity, 0) ?? 0

   const cartItemCount = cart?.items.reduce((sum, item)=> sum + item.quantity,0)?? 0

   return {
      cart,
      isError,
      isLoading,
      cartTotal,
      cartItemCount,
      updateQuantity:updateCartQuantityMutation.mutate,
      removeFromCart:removeFromCartMutation.mutate,
      clearCart:clearCartMutation.mutate,
      addToCart: addToCartMutation.mutateAsync,
      isAddingToCart: addToCartMutation.isPending ? addToCartMutation.variables.productId : null,
      isRemovingFromCart: removeFromCartMutation.isPending ? removeFromCartMutation.variables: null,
      isClearingCart:clearCartMutation.isPending,
      isUpdatingQuantity:updateCartQuantityMutation.isPending
   }
}

export default useCart
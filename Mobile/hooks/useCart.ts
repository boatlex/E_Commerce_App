import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/lib/api'
import { Cart } from '@/types'

const useCart = ()=>{


const queryClient = useQueryClient()

const api = useApi()
 
const addToCartMutation = useMutation({
     mutationFn: async ({productId, quantity=1}:{productId:string, quantity?:number})=>{
       const {data} = await api.post<{cart:Cart}>("/carts", {productId, quantity})
       return data.cart
     },

     onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['cart']})
     },
    
 })

    return{
       addToCart:addToCartMutation.mutate,
       isAddingToCart:addToCartMutation.isPending?addToCartMutation.variables.productId:null 
    }
}

export default useCart
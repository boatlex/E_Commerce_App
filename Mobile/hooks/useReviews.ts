import { useApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface createReviewData{
    productId:string
    orderId:string
    rating:number
}

export const useReviews =()=>{
 const api = useApi()
 const queryClient = useQueryClient()


 const createReview = useMutation({
    mutationFn: async (data:createReviewData)=>{
     const response = await api.post("/review")
       return response.data
    },
    onSuccess : ()=>{
        queryClient.invalidateQueries({queryKey:["products"]})
        queryClient.invalidateQueries({queryKey:["orders"]})
    }
 })
   
 return {
    isCreatingReview: createReview.isPending,
    createReviewAsync:createReview.mutateAsync
 }

}
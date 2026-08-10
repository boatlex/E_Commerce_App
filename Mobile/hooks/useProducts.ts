import { useApi } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types'

const useProducts = () => {

  const api = useApi()

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<{products:Product[]}>("/products")
      return data?.products
    }
  })


  return {
    results,
    isLoading,
    isError,
  }


}

export default useProducts
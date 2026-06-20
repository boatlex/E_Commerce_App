import React from 'react'
import {useQuery} from "@tanstack/react-query"
import { orderApi } from '../lib/api'


const DashboardPage = () => {


  const {data, isLoading} = useQuery({
    queryKey:["orders"],
    queryFn: orderApi.getAllOrders
  })

  console.log('orders:',data)
  console.log('isloading:', isLoading)

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage
import React from 'react'
import {useQuery} from "@tanstack/react-query"
import { orderApi, statsApi } from '../lib/api'
import { DollarSignIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from 'lucide-react'; 
import { capitalizedText, formatDate, getOrderStatusBadge } from '../lib/utils';



const DashboardPage = () => {


  const {data:ordersData, isLoadingOders} = useQuery({
    queryKey:["orders"],
    queryFn: orderApi.getAllOrders
  })

 const {data:statsData, isLoading:statsIsloading}=useQuery({
    queryKey:["dashBoardStats"],
    queryFn:statsApi.getDashBoard
 })

 const recentOrders = ordersData?.orders?.slice(0,5) ||[]


 const statsCard =[
  {
    name:"Total Revenue",
    value:statsIsloading?"...":`$${statsData?.totalRevenue?.toFixed(2) || 0}`,
    icon:<DollarSignIcon className='w-8 h-8'/>
  },
  {
    name:"Total Orders",
    value:statsIsloading?"...":statsData?.totalOrders || 0,
    icon:<ShoppingBagIcon className='size-8'/>
  },
  {
    name:"Total Customers",
    value:statsIsloading?"...":statsData?.totalCustomers || 0,
    icon:<UsersIcon className='size-8'/>
  },
  {
    name:"Total Products",
    value:statsIsloading?"...":statsData?.totalProducts || 0,
    icon:<PackageIcon className='size-8'/>
  },
 ]

  return (
    <div className='space-y-6'>

       <div className='stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100'>
         {statsCard.map((stat)=>(
          <div key={stat.name} className='stat'>
            <div className='stat-figure text-primary'>{stat.icon}</div>
            <div className='stat-title'>{stat.name}</div>
            <div className='stat-value'>{stat.value}</div>
          </div>
         ))}
       </div>

      <div className='card bg-base-100 shadow-xl'>
         <div className='card-body'>
           <h2 className='card-title'>Recent Orders</h2>

           {isLoadingOders?(
            <div className='flex-justify-center py-8'>
              <span className='loading loading-spinner loading-lg'/>
            </div>
           ): recentOrders.length===0?(
            <div className='text-center py=8 text-base-content/60'> No Orders Yet</div>
           ):(
             <div className='overflow-x-auto'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Order Id</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order)=>(
                      <tr key={order._id}>
                        <td>
                          <span className='font-medium'>{order._id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td>
                          <div className='font-medium'>{order.shippingAddress.fullName}</div>
                          <div>
                            {order.orderItems.length} Item(s)
                          </div>
                        </td>

                        <td>
                          <div className='text-sm'>
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 && `+${order.orderItems.length-1} more`}
                          </div>
                        </td>

                        <td>
                          <span className='font-semibold'>{order.totalPrice.toFixed(2)}</span>
                        </td>

                        <td>
                          <div className={`badge ${getOrderStatusBadge(order.status)}`}>
                             {capitalizedText(order.status)}
                          </div>
                        </td>

                        <td>
                          <span className='text-sm opacity-60'>{formatDate(order.createdAt)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           )}
         </div>
      </div>
    </div>

   
  )
}

export default DashboardPage
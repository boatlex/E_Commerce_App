import React from 'react'
import { customerApi } from "../lib/api.js"
import { formatDate } from "../lib/utils.js"
import { useQuery } from "@tanstack/react-query"




const CustomersPage = () => {

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.fetchAllCustomers
  })

  const customers = customersData?.customers || []

  const customersOnly = customers.filter((user) => user.role === "customer")

   console.log(customersOnly)

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold' > Customers</h1>
        <p className='text-base-content/70 mt-1'>
          {customersOnly.length} {customersOnly.length === 1 ? "Customer" : "Customers"} Registered
        </p>
      </div>

      {/* Customers Table */}
      <div className='card bg-base-100 shadow-xl'>
        <div className="card-body">
          {isLoading ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : customers.length === 0 ? (
            <div className='text-center py-12 text-base-content/60'>
              <p className='text-xl font-semibold mb-2'>No Customers Yet</p>
              <p className='text-sm'>Customers  will appear Here once they register</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Custer</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>WishList</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customersOnly.map((customer) => (
                    <tr key={customer._id}>
                      <td className='flex items-center gap-3'>
                        <div className='avatar-placeholder'>
                          <div className='bg-primary text-primary-content rounded-full w-12'>
                            <img src={customer.imageUrl}
                              alt={customer.name}
                              className='w-12 h-12 rounded-full'
                            />
                          </div>
                        </div>
                        <div className='font-semibold'>{customer.name}</div>
                      </td>

                      <td>{customer.email}</td>
                      <td >
                        <div className='badge badge-ghost'>
                          {customer.addresses?.length || 0} Address (es)
                        </div>
                      </td>
                      <td>
                        <div className='badge badge-ghost'>
                          {customer.wishList.length || 0} Item(s)
                        </div>
                      </td>
                      <td>
                        <span className='text-sm opacity-60'>
                            {formatDate(customer.createdAt)}
                        </span>
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

export default CustomersPage
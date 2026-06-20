import { ClipboardListIcon, HomeIcon, PanelLeftIcon, ShoppingBagIcon, UsersIcon } from 'lucide-react'
import React from 'react'
import {UserButton} from "@clerk/clerk-react"
import { useLocation } from 'react-router'



  export const NAVIGATION =[
    {name:"Dashboard", path:"/dashboard", icon:<HomeIcon className='size-6'/>},
    {name:"Products", path:"/products", icon:<ShoppingBagIcon className='size-6'/>},
    {name:"Orders", path:"/orders", icon:<ClipboardListIcon className='size-6'/>},
    {name:"Customers", path:"/customers", icon:<UsersIcon className='size-6'/>},
  ]

const NavBar = () => {

    const location =useLocation()
    
  return (
    <div className='navbar w-full bg-base-300'>
<label htmlFor='my-drawer' className='btn btn-square btn-ghost' aria-label='open-sidebar'>
    <PanelLeftIcon className='size-6'/>
</label>


    <div className='flex-1 px4'>
       <h1 className='text-xl font-bold'>
        {NAVIGATION.find((item)=>item.path ===location.pathname)?.name || "dashboard"}
       </h1>
    </div>

    <div>
        <UserButton/>
    </div>
    </div>
  )
}

export default NavBar
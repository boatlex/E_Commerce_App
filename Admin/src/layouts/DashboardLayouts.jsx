import React from 'react'
import { Outlet } from 'react-router'

const DashboardLayouts = () => {
  return (
    <div>
         <h1>sideBar</h1>
         <h1>navBar</h1>
        <Outlet/>
    </div>
  )
}

export default DashboardLayouts
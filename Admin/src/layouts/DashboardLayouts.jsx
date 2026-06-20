import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { useSyncHook } from '../hooks/useSyncHook'
import { useAuth } from '@clerk/clerk-react';

const DashboardLayouts = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { userSyncMutation } = useSyncHook();

 const { user, message } = userSyncMutation.data || {};
      
  useEffect(() => {
  
    if (!isLoaded || !isSignedIn) return;

    if (!userSyncMutation.data && !userSyncMutation.isPending && !userSyncMutation.isError) {
      userSyncMutation.mutate();
    }

  }, [isLoaded, isSignedIn, userSyncMutation.data, userSyncMutation.isPending,
     userSyncMutation.isError, userSyncMutation.mutate]);


  return (
    <div className='drawer lg:drawer-open'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' defaultChecked />
      <div className='drawer-content'>
        <NavBar />
        <main className='p-6'>
          <Outlet />
        </main>
      </div>
      <SideBar />
    </div>
  )
}

export default DashboardLayouts

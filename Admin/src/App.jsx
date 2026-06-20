import { Navigate, Route, Routes } from "react-router"
import { useAuth } from "@clerk/clerk-react";
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import DashboardLayouts from "./layouts/DashboardLayouts";
//import PageLoader from "./components/PageLoader";
import { LoaderIcon } from 'lucide-react'





function App() {
  const { isSignedIn, isLoaded } = useAuth()

  

  if (!isLoaded) {
    //<PageLoader/>
    return (
    <div className="flex items-center justify-center h-screen">
        <LoaderIcon className='size-14 animate-spin'/>
    </div>
  )
  }
    

  return (
    <Routes>

      <Route path='/login' element={isSignedIn ?
        <Navigate to={"/dashboard"} /> : <LoginPage />} />

      <Route path="/" element={isSignedIn ? <DashboardLayouts /> : <Navigate to={"/login"} />}>
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
}

export default App;



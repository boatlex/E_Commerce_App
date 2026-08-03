import { Redirect, Stack } from "expo-router"
import { useAuth } from '@clerk/expo'

 export const AuthRoutesLayout = ()=>{
 const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null
 if(isSignedIn){
    return <Redirect href={"/(tabs)"}/>
 }

      return (
        < Stack screenOptions={{headerShown:false}}/>
      )
 }

 export default AuthRoutesLayout
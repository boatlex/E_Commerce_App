import { Redirect, Stack } from "expo-router"
import { useAuth } from '@clerk/expo'

 export const AuthRoutesLayout = ()=>{
 const { isLoaded, isSignedIn } = useAuth()


 if(isSignedIn){
    return <Redirect href={"/"}/>
 }

      return (
        < Stack screenOptions={{headerShown:false}}/>
      )
 }
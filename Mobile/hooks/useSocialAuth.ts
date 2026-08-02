import { View, Text, Alert } from 'react-native'
import { useState } from 'react'
import { useAuth, useSSO } from '@clerk/expo'
import * as WebBrowser from 'expo-web-browser'
 
// Handles the redirection when the app resumes after browser login
WebBrowser.maybeCompleteAuthSession()

type AuthStrategy = 'oauth_google' | 'oauth_apple';
const useSocialAuth = () => {
 const [loadingStrategy, setLoadingStrategy] = useState<AuthStrategy | null>(null)
  //const { isLoaded, isSignedIn } = useAuth()
  const { startSSOFlow } = useSSO()

  const handleSocialAuth = async (strategy: AuthStrategy) => {
    setLoadingStrategy(strategy)
    try {
      
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: strategy,
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch (error) {
      console.error('SocialAuth Authentication Error:', error)
      const provider = strategy ==="oauth_google"? "Google":"Apple"
      Alert.alert("Error",`Failed to sign in with ${provider}. Please try again`)
    }finally{
        setLoadingStrategy(null)
    }
  }


  return {loadingStrategy, handleSocialAuth}
   
}

export default useSocialAuth
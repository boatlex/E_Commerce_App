import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'

function LoginPage() {
  const { isLoaded } = useAuth()

  if (!isLoaded) return <div
   className="h-screen flex items-center justify-center text-gray-500 font-medium"
   >Checking authorization...</div>

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col justify-center items-center gap-6 p-4">
      
      <SignedOut>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Home Page</h1>
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition shadow-sm">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn> 
        <div className="flex flex-col items-center gap-4 text-center">
          <UserButton />
          <h1 className="text-xl font-semibold text-gray-800">Dashboard profile section</h1>
        </div>
      </SignedIn>

    </div>
  )
}

export default LoginPage

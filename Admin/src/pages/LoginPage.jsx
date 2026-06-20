import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'

function LoginPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <div>Checking authorization...</div>

  return (
    <div>
      <h1>Home Page</h1>
      <SignedOut><SignInButton /></SignedOut>
      <SignedIn>
        <UserButton />
        <p>Dashboard profile section</p>
      </SignedIn>
    </div>
  )
}

export default LoginPage

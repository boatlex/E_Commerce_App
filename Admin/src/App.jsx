import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/clerk-react"



function App() {
  return (
    <div>
      <h1>Home Page</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton/>
      </SignedIn>
    </div>
  )
}

export default App

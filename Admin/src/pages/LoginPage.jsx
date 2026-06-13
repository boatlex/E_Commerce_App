// import React,{useEffect} from 'react'
// import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react'



//  const { getToken, isSignedIn, isLoaded } = useAuth();

//   useEffect(() => {
//     const syncUserWithDatabase = async () => {
//       if (!isLoaded || !isSignedIn) return;

//       try {
//         const token = await getToken();
//         const targetUrl = import.meta.env.DEV
//           ? "http://localhost:3000/api/users/sync-user"
//           : "/api/users/sync-user";

//         const response = await fetch(targetUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//           }
//         });

//         if (!response.ok) throw new Error("Sync failed");
//         const data = await response.json();
//         console.log("Database sync response:", data);
//       } catch (error) {
//         console.error("Failed to sync user to MongoDB:", error);
//       }
//     };

//     syncUserWithDatabase();
//   }, [isSignedIn, isLoaded, getToken]);


  

//   function LoginPage() {
//     return (
//     <>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>

//       <SignedOut>
//         <SignInButton mode="modal" />
//       </SignedOut>
//     </>
//     );


//   }

 
//   export default LoginPage


import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'

function LoginPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    const syncUserWithDatabase = async () => {
      // 1. Wait until Clerk is fully loaded and a user is signed in
      if (!isLoaded || !isSignedIn) return

      try {
        // 2. Retrieve the short-lived session token
        const token = await getToken()

        // 3. Determine URL automatically (Development vs. Sevalla Production)
        const targetUrl = import.meta.env.DEV 
          ? "http://localhost:3000/api/users/sync-user" 
          : "/api/users/sync-user"

        // 4. Fire the synchronization request
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await response.json()
        console.log("Database sync response:", data)

      } catch (error) {
        console.error("Failed to sync user to MongoDB:", error)
      }
    }

    syncUserWithDatabase()
  }, [isSignedIn, isLoaded, getToken])


   return (
    <div>
      <h1>Home Page</h1>

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
        {/* You can render your main application content or dashboards here */}
        <p>You are logged in and successfully synced to MongoDB!</p>
      </SignedIn>
    </div>
  )
}

export default LoginPage
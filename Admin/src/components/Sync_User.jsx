import React, { useEffect } from 'react' // 1. Added useEffect here
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react'
import SyncUser from '../components/Sync_User'

function UserSyncWrapper() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const syncUserWithDatabase = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        const targetUrl = import.meta.env.DEV
          ? "http://localhost:3000/api/users/sync-user"
          : "/api/users/sync-user";

        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Sync failed");
        const data = await response.json();
        console.log("Database sync response:", data);
      } catch (error) {
        console.error("Failed to sync user to MongoDB:", error);
      }
    };

    syncUserWithDatabase();
  }, [isSignedIn, isLoaded, getToken]);

  // 2. Separated from LoginPage logic and returning the actual view
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </>
  );
}

export default UserSyncWrapper; // 3. Exported the correct wrapper component

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../lib/axios.js";



export const useSyncHook = () => {
  const { getToken } = useAuth();

  const userSyncMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken()

      const { data } = await axiosInstance.post("/users/sync-user", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    
     },
     onSuccess:({user, message})=>{
        console.log("Status Message:", message)
     }
  });

  
  return { userSyncMutation }; 
};

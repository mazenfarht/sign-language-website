import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null); // Fix: Change initial state to null
  const [error, setError] = useState(null);
  const recipientId = chat?.members?.find((id) => id !== user?._id);
  
  
  // console.log("Recipient ID:", recipientId);

  // console.log("recipientUserrrrrrrrrrr",recipientUser?.name)

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
  
      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
  
      if (response.error) {
        return setError(response);
      }
  
      // Add this line
  
      setRecipientUser(response);
    };
  
    getUser();
  }, [recipientId]);

    

  return { recipientUser };
};
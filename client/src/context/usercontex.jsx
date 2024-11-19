import { useToast } from "@/hooks/use-toast";

import { getDetails } from "@/util/fetchHandlers";
import { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./globaleContext";

const userContex = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [verfiying, setVerifiyingStatus] = useState(true);
  const { setIsLoading } = useGlobalContext();
  const { toast } = useToast();
  useEffect(() => {
    async function verifyUser() {
      setIsLoading(true);
      try {
        let userDetail = await getDetails("/api/users/currentUser");

        if (userDetail.status != "failed") {
          setCurrentUser(JSON.parse(userDetail.detail));
        } else {
          userDetail = await getDetails("/api/users/refreshToken");
          if (userDetail.status === "failed") {
            throw new Error(userDetail.message);
          } else {
            setCurrentUser(JSON.parse(userDetail.detail));
          }
        }

        return userDetail;
      } catch (err) {
        if (err.message !== "Access Token not Found") {
          toast({
            duration: 1000,
            variant: "destructive",
            title: "Error ",
            description: err.message,
          });
        }
      } finally {
        setIsLoading(false);

        setVerifiyingStatus(false);
      }
    }
    verifyUser();
  }, []);
  console.log(currentUser);
  return (
    <userContex.Provider value={{ currentUser, setCurrentUser, verfiying }}>
      {children}
    </userContex.Provider>
  );
}

export function useUserContext() {
  const value = useContext(userContex);
  return value;
}

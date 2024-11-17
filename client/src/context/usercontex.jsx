import { createContext, useContext, useEffect, useState } from "react";

const userContex = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [verfiying, setVerifiyingStatus] = useState(true);
  useEffect(() => {
    async function verifyUser() {
      const res = await fetch("http://localhost:8080/users/currentUser", {
        headers: {
          "Content-Type": "application/json", // Set content type if necessary
        },
        credentials: "include",
      });
      const userDetail = await res.json();
      if (userDetail.status != "failed")
        setCurrentUser(JSON.parse(userDetail.detail));
      setVerifiyingStatus(false);
      return userDetail;
    }
    verifyUser();
  }, []);
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

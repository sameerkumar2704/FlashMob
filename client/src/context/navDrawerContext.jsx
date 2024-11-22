import { useContext, createContext, useState } from "react";

const context = createContext();
export function NavDrawerProvider({ children }) {
  const [openDrawer, setDrawerStatus] = useState("close");
  return (
    <context.Provider value={{ openDrawer, setDrawerStatus }}>
      {children}
    </context.Provider>
  );
}
export function useNavDrawer() {
  const obj = useContext(context);
  return obj;
}

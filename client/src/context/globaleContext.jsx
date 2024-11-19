import { createContext, useContext, useEffect, useState } from "react";

const context = createContext();

function GlobalProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <context.Provider value={{ isLoading, setIsLoading, show, setShow }}>
      {children}
      {isLoading && (
        <div className=' fixed left-0 right-0 top-0 bottom-0 bg-white z-10'>
          <h1 className=' font-bold '>Loading......</h1>
        </div>
      )}
    </context.Provider>
  );
}

function useGlobalContext() {
  const value = useContext(context);
  return value;
}
export { useGlobalContext, GlobalProvider };

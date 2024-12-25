import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => {
    setIsLoading(true);
    setTimeout(() => {
      hideLoader();
    }, 1500);
  };

  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      {isLoading && <SilverScreenLoader />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

const SilverScreenLoader = () =>
  <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-90 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
  </div>;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/usercontex";
import { GlobalProvider } from "./context/globaleContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </GlobalProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { globalStore } from "./redux/store";
import { GlobalContent } from "./globalContent";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={globalStore}>
      <GlobalContent>
        <App />
      </GlobalContent>
    </Provider>
  </StrictMode>
);

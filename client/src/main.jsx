import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { globalStore } from "./redux/store";
import { GlobalContent } from "./globalContent";
import { LoaderProvider } from "./context/LoaderContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense
      fallback={
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div className='spinner'></div>
          <p>Loading data, please wait...</p>
        </div>
      }
    >
      <Provider store={globalStore}>
        <LoaderProvider>
          <GlobalContent>
            <App />
          </GlobalContent>
        </LoaderProvider>
      </Provider>
    </Suspense>
  </StrictMode>
);

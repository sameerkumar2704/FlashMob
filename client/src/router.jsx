import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/landingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/landingPage";
import ProductDetails from "./pages/ProductDetails";
import { FilterProductPage } from "./pages/FilterProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "filter-products",
        element: <FilterProductPage />,
      },
    ],
  },
]);

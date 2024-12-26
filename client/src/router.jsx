import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/landingPage";
import ProductDetails from "./pages/ProductDetails";
import { FilterProductPage } from "./pages/FilterProductPage";
import { getDetails } from "./util/fetchHandlers";
import { ForgotPassword } from "./pages/ForgotPassword";

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
        path: "filter-products/:type",
        loader: ({ params }) =>
          getDetails(`/api/product/${params.type}?limit=8&&page=1`),
        element: <FilterProductPage />,
      },
      {
        path: "search/:searchText",
        loader: ({ params }) => {
          const { searchText } = params; // Extract searchText from params
          return getDetails(`/api/product/all?search=${searchText}`);
        },
        element: <FilterProductPage />,
      },
    ],
  },
  {
    path: "cart",
    loader: () => getDetails("/api/cart/all"),
    element: <FilterProductPage />,
  },
  {
    path: "forgotPassword",
    element: <ForgotPassword />,
  },
]);

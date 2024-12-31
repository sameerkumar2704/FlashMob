import { createBrowserRouter, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import ProductDetails from "./pages/ProductDetails";
import { FilterProductPage } from "./pages/FilterProductPage";
import { getDetails } from "./util/fetchHandlers";
// import { ForgotPassword } from "./pages/ForgotPassword";
import { ProfilePage } from "./pages/ProfilePage";
import { globalStore } from "./redux/store";
import ShoppingCart from "./pages/ShoppingCart";
import { ViewAllPage } from "./pages/ViewAllPage";
import ShoppingCheckout from "./pages/ShoppingCheckout";
import { OrderList } from "./pages/OrderPage";

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
        element: <ViewAllPage />,
      },
      {
        path: "search/:searchText",

        element: <FilterProductPage />,
      },

      {
        path: "profile",
        loader: () => {
          const state = globalStore.getState();
          if (!state.global.currentUser)
            throw new Response("", { status: 302, headers: { Location: "/" } });
          return getDetails(
            "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/users/"
          );
        },

        element: <ProfilePage />,
      },

      {
        path: "cart",
        loader: () => {
          const state = globalStore.getState();
          if (!state.global.currentUser)
            throw new Response("", { status: 302, headers: { Location: "/" } });
          return getDetails(
            "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/cart/all"
          );
        },
        element: <ShoppingCart />,
      },
      {
        path: "/checkOut",
        element: <ShoppingCheckout />,
      },
      {
        path: "/orders",
        element: <OrderList />,
      },
    ],
  },

  // {
  //   path: "forgotPassword",
  //   element: <ForgotPassword />,
  // },
]);

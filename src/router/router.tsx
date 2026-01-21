import { createBrowserRouter, redirect } from "react-router";
import RootLayout from "../layouts/RootLayout";
import ProductPage from "../pages/ProductPage";
import { productsLoader } from "../pages/ProductPage";
import ProductDetail, { productDetailLoader } from "../pages/ProductDetail";
import { favoritesAction } from "../actions/favoritesAction";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, loader: () => redirect("/products") },
      {
        path: "products",
        Component: ProductPage,
        loader: productsLoader,
   
      },
      {
        path: "products/:id",
        Component: ProductDetail,
        loader: productDetailLoader,
      },
      {
        path : "favorites",
        action : favoritesAction,
      }
    ],
  },
]);

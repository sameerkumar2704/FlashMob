import { loadingState } from "@/redux/slice";
import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { getDetails } from "@/util/fetchHandlers";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoader } from "@/context/LoaderContext";

export function HomePage() {
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const [products, setProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const dispatch = useDispatch();

  const getAllProducts = useCallback(
    async (category) => {
      let url = `/api/product/all?limit=5&&products=other`;
      if (category !== "all") url += `&category=${category}`;
      const data = await getDetails(url);
      setProducts(data.list || []);
    },
    []
  );

  const getDiscountedProducts = useCallback(
    async (category) => {
      let url = `/api/product/sale?limit=5`;
      if (category !== "all") url += `&category=${category}`;
      const data = await getDetails(url);
      setDiscountedProducts(data.list || []);
    },
    []
  );

  const getNewProducts = useCallback(
    async (category) => {
      let url = `/api/product/new?limit=5`;
      if (category !== "all") url += `&category=${category}`;
      const data = await getDetails(url);
      setNewProducts(data.list || []);
    },
    []
  );

  const LoadData = useCallback(
    (category) => {
      showLoader(); // Show loader
      dispatch(loadingState(true)); // Optional: Redux state for loading
      Promise.all([
        getAllProducts(category),
        getDiscountedProducts(category),
        getNewProducts(category),
      ])
        .finally(() => {
          dispatch(loadingState(false)); // Update Redux loading state
        });
    },
    [dispatch, getAllProducts, getDiscountedProducts, getNewProducts]
  );

  useEffect(() => {
    LoadData("all"); // Load all products initially
  }, [LoadData]);

  return (
    <>
      <div className="h-full space-y-8 overflow-scroll scroll-smooth hide-scroll-bar">
        <Category dataHandler={LoadData} />
        {newProducts.length > 0 && (
          <HorizontalView title={"New Products"} productList={newProducts} />
        )}
        {discountedProducts.length > 0 && (
          <HorizontalView
            title={"Discounted Products"}
            productList={discountedProducts}
          />
        )}
        {products.length > 0 && (
          <HorizontalView title={"Products"} productList={products} />
        )}
      </div>
    </>
  );
}

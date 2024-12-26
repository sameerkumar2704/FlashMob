import { loadingState } from "@/redux/slice";
import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { getDetails } from "@/util/fetchHandlers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoader } from "@/context/LoaderContext";

export function HomePage() {
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const [products, setProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const dispatch = useDispatch();

  const getDiscountedProducts = useCallback(async (category) => {
    let url = `/api/product/sale?limit=5`;
    if (category !== "all") url += `&category=${category}`;
    const data = await getDetails(url);
    setDiscountedProducts(data.list || []);
  }, []);

  const getNewProducts = useCallback(async (category) => {
    let url = `/api/product/new?limit=5`;
    if (category !== "all") url += `&category=${category}`;
    const data = await getDetails(url);
    setNewProducts(data.list || []);
  }, []);

  const LoadData = useCallback(
    (category) => {
      dispatch(loadingState(true)); // Optional: Redux state for loading
      Promise.all([
        getDiscountedProducts(category),
        getNewProducts(category),
      ]).finally(() => {
        dispatch(loadingState(false)); // Update Redux loading state
      });
    },
    [dispatch, getDiscountedProducts, getNewProducts]
  );
  const categories = useRef([
    "laptop",
    "appliances",
    "gaming",
    "tv",
    "mobile",
    "audio",
  ]);
  const [category, setCategory] = useState(categories.current[0]);
  return (
    <>
      <div className='h-full space-y-8 overflow-scroll scroll-smooth hide-scroll-bar'>
        <Category
          category={category}
          setCategory={setCategory}
          categoriesList={categories}
          dataHandler={LoadData}
        />
        {newProducts.length > 0 && (
          <HorizontalView
            title={"New Products"}
            categoryType={category}
            viewAllLEndPoint='new'
            productList={newProducts}
          />
        )}
        {discountedProducts.length > 0 && (
          <HorizontalView
            viewAllLEndPoint='sale'
            categoryType={category}
            title={"Discounted Products"}
            productList={discountedProducts}
          />
        )}
      </div>
    </>
  );
}

import { loadingState } from "@/redux/slice";
import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { getDetails } from "@/util/fetchHandlers";
import { Underline } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function HomePage() {
  const { isDataLoading } = useSelector((state) => state.global);
  const [products, setProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const dispatch = useDispatch();
  const getAllProducts = useCallback(
    (category) => {
      let url = `/api/product/all?limit=5&&products=other`;
      if (category !== "all") url += `&category=${category}`;
      dispatch(loadingState(true));
      getDetails(url).then((curr) => {
        setProducts(curr.list);
      });
    },
    [dispatch]
  );
  const getDiscountedProducts = useCallback(
    (category) => {
      let url = `/api/product/sale?limit=5`;
      console.log(category);
      if (category !== "all") url += `&category=${category}`;
      dispatch(loadingState(true));
      getDetails(url).then((curr) => {
        setDiscountedProducts(curr.list);
      });
    },
    [dispatch]
  );
  const getNewProducts = useCallback(
    (category) => {
      let url = `/api/product/new?limit=5`;
      if (category !== "all") url += `&categroy=${category}`;
      dispatch(loadingState(true));
      getDetails(url).then((curr) => {
        setNewProducts(curr.list);
      });
    },
    [dispatch]
  );
  const LoadData = useCallback(
    (category) => {
      Promise.all([
        getAllProducts(category),
        getDiscountedProducts(category),
        getNewProducts(category),
      ]).finally(() => dispatch(loadingState(false)));
    },
    [dispatch, getAllProducts, getDiscountedProducts, getNewProducts]
  );

  return (
    <>
      <div className=' h-full space-y-8 overflow-scroll scroll-smooth hide-scroll-bar'>
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

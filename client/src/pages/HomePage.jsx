import { loadingState } from "@/redux/slice";
import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { getDetails } from "@/util/fetchHandlers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function HomePage() {
  const { isDataLoading } = useSelector((state) => state.global);
  const [products, setProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAllProducts() {
      const url = `/api/product/all?limit=5`;
      dispatch(loadingState(true));
      getDetails(url).then((curr) => {
        setProducts(curr);
      });
    }
    async function getDiscountedProducts() {
      const url = `/api/product/sale?limit=5`;
      dispatch(loadingState(true));
      getDetails(url).then((curr) => {
        setDiscountedProducts(curr);
      });
    }
    async function getNewProducts() {
      const url = `/api/product/new?limit=5`;
      dispatch(loadingState(true));
      getDetails(url).then((curr) => {
        setNewProducts(curr);
      });
    }

    Promise.all([
      getAllProducts(),
      getDiscountedProducts(),
      getNewProducts(),
    ]).finally(() => dispatch(loadingState(false)));
  }, []);
  if (isDataLoading) {
    return <h1>Loading .... {isDataLoading}</h1>;
  }
  return (
    <>
      <div className=' h-full space-y-8 overflow-scroll scroll-smooth hide-scroll-bar'>
        <Category />

        <HorizontalView
          title={"Discounted Products"}
          productList={discountedProducts}
        />
        <HorizontalView title={"Products"} productList={products} />
        <HorizontalView title={"New Products"} productList={newProducts} />
      </div>
    </>
  );
}

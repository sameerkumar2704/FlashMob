import { getAllProducts } from "@/redux/slice";
import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function HomePage() {
  const { productList, isDataLoading } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  if (isDataLoading) {
    return <h1>Loading .... {isDataLoading}</h1>;
  }
  return (
    <>
      <Category />
      <HorizontalView productList={productList} />
    </>
  );
}

import { getAllProducts } from "@/redux/slice";
import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      <Link to="/filter-products">
        <Button variant="primary">Filter Products</Button>
      </Link>
    </>
  );
}

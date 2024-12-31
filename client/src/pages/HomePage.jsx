import { Category } from "@/UiElements/category";
import { HorizontalView } from "@/UiElements/HorizontalView";
import { getDetails } from "@/util/fetchHandlers";
import { useCallback, useEffect, useRef, useState } from "react";

export function HomePage() {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDiscountedProducts = useCallback(async (category) => {
    let url = `https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/product/sale?limit=5`;
    if (category !== "all") url += `&category=${category}`;
    const data = await getDetails(url);
    setDiscountedProducts(data.list || []);
  }, []);

  const getNewProducts = useCallback(async (category) => {
    let url = `https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/product/new?limit=5`;
    if (category !== "all") url += `&category=${category}`;
    const data = await getDetails(url);
    setNewProducts(data.list || []);
  }, []);

  const LoadData = useCallback(
    (category) => {
      setIsLoading(true);
      Promise.all([
        getDiscountedProducts(category),
        getNewProducts(category),
      ]).finally(() => {
        setIsLoading(false);
      });
    },
    [getDiscountedProducts, getNewProducts]
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

  const handleCategoryChange = useCallback(
    (category) => {
      setIsLoading(true);
      Promise.all([
        getDiscountedProducts(category),
        getNewProducts(category),
      ]).catch(() => {
        setIsLoading(false);
      });
    },
    [getDiscountedProducts, getNewProducts]
  );
  useEffect(() => {
    LoadData(category);
  }, [category]);

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-[calc(100vh-4rem)] bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500' />
      </div>
    );
  return (
    <>
      <div className='h-full space-y-8 overflow-scroll scroll-smooth hide-scroll-bar'>
        <Category
          category={category}
          setCategory={setCategory}
          categoriesList={categories}
          dataHandler={handleCategoryChange}
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

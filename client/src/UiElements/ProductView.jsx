import { useState } from "react";
import { RatingComponents } from "./RatingComponent";
import { Button } from "@/components/ui/button";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
export function ProductView({ productDetails }) {
  const [showAddToCart, setAddToCart] = useState(false);
  const [faviourate, setAsFaviourate] = useState(productDetails.faviourate);
  return (
    <div
      onMouseLeave={() => setAddToCart(false)}
      onMouseEnter={() => setAddToCart(true)}
      className=' text-sm space-y-1'
    >
      <div className=' max-lg:h-44  relative min-w-48  h-52 bg-gray-100 '>
        <div
          className={` absolute left-0 right-0 bottom-0 bg-black text-white text-center p-1 ${
            showAddToCart ? "visible" : "hidden"
          }`}
        >
          <Button>add to cart</Button>
        </div>
        <div className=' absolute right-0 top-0 p-2'>
          {faviourate ? (
            <IoHeart className='fill-red-500' />
          ) : (
            <IoIosHeartEmpty />
          )}
        </div>
        <div className=' absolute left-0 top-0'>
          <h1 className=' bg-green-400 text-white font-semibold p-1 rounded-md  m-2 text-xs'>
            New
          </h1>
        </div>
      </div>
      <h1 className=' font-semibold'>{productDetails.title}</h1>
      <h1 className=' text-red-500'>₹.{productDetails.price}</h1>
      <RatingComponents ratingCount={productDetails.starCount} />
    </div>
  );
}

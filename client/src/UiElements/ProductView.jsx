import { useState } from "react";
import { RatingComponents } from "./RatingComponent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProductView({ productDetails }) {
  const navigator = useNavigate();

  // const [faviourate, setAsFaviourate] = useState(productDetails.faviourate);
  // const { setItemList } = useCartContext();
  console.log(productDetails);
  return (
    <div
      onClick={() =>
        navigator(`/product/${productDetails.title.split(" ").join("-")}`)
      }
      className=' text-sm space-y-1'
    >
      <div className=' max-lg:h-44  relative min-w-48  h-52 bg-gray-100 '>
        <img src={productDetails.img} />

        <div className=' absolute right-0 top-0 p-2'>
          {/* {1 === 1 ? <IoHeart className='fill-red-500' /> : <IoIosHeartEmpty />} */}
        </div>
        <div className=' absolute left-0 top-0'>
          <h1 className=' bg-green-400 text-white font-semibold p-1 rounded-md  m-2 text-xs'>
            New
          </h1>
        </div>
      </div>
      {productDetails.isSoldOut ? (
        <h1 className='px-3 py-1 bg-red-500 text-white'>sold out</h1>
      ) : (
        <>
          <h1 className=' font-semibold'>{productDetails.title}</h1>
          <h1 className=' text-red-500'>₹.{productDetails.price}</h1>
          <RatingComponents ratingCount={productDetails.starCount} />
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { GoHeart } from "react-icons/go";
import { MdOutlineLocalShipping, MdVerified } from "react-icons/md";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { getDetails, postDetails } from "@/util/fetchHandlers";
import { useSelector } from "react-redux";
import { asyncHandler } from "@/util/asynHandler";

function ProductOverviewImage({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='relative w-full h-64 sm:h-80 md:h-[400px] bg-gray-200 overflow-hidden rounded-lg shadow-md'>
      <img
        src={images[currentImageIndex]}
        alt='Product'
        className='w-full h-full object-cover'
      />
      <button
        onClick={prevImage}
        className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-md'
      >
        <AiOutlineLeft size={20} />
      </button>
      <button
        onClick={nextImage}
        className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-md'
      >
        <AiOutlineRight size={20} />
      </button>
    </div>
  );
}

function ColorSelector({ selectedColor, setSelectedColor, color }) {
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      onClick={() => setSelectedColor(color)}
      className={`w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-full cursor-pointer ${
        color === selectedColor ? "border-red-950 " : "border-gray-300"
      }`}
    />
  );
}

function SizeSelector({ selectedSize, setSelectedSize, currSize }) {
  return (
    <div
      className={`text-xs sm:text-sm border w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer rounded-md ${
        currSize === selectedSize
          ? "bg-red-500 text-white border-gray-500"
          : "bg-white text-black border-gray-300"
      }`}
      onClick={() => setSelectedSize(currSize)}
    >
      {currSize}
    </div>
  );
}

function ProductDetails() {
  const { productId } = useParams();
  const [productDetails, setProdcutDetails] = useState(undefined);
  const [presentInCart, setPresentInCart] = useState(false);
  const { currentUser } = useSelector((state) => state.global);
  useEffect(() => {
    asyncHandler(async () => {
      const res = await getDetails(
        `http://localhost:8080/product?productId=${productId}`
      );
      setProdcutDetails(res.details);
    })();
  }, [productId]);
  useEffect(() => {
    if (!productDetails) return;
    asyncHandler(async () => {
      const res = await getDetails(
        `http://localhost:8080/cart/productIsPresent?user=${currentUser._id}&product_item=${productDetails._id}`
      );
      setPresentInCart(res.productInCart);
    })();
  }, [currentUser._id, productDetails]);

  const product = {
    title: "Premium T-Shirt",
    images: ["/images/tshirt1.jpg", "/images/tshirt2.jpg"],
    price: 29.99,
    rating: 4.5,
    reviewsCount: 120,
    description:
      "Soft and comfortable t-shirt made from 100% cotton. Perfect for casual wear or layering. Available in multiple vibrant colors and sizes.",
    highlights: [
      "100% Cotton",
      "Breathable and lightweight",
      "Available in 4 colors",
      "Eco-friendly materials",
    ],
    details: [
      "Care: Machine wash cold",
      "Imported",
      "Warranty: 6 months",
      "Unisex fit",
    ],
    colors: ["red", "blue", "green", "black"],
    sizes: ["S", "M", "L", "XL"],
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  if (!productDetails) return <h1>Loading...</h1>;
  return (
    <div className='p-4 sm:p-6 grid gap-10 md:grid-cols-2'>
      {/* Image Section */}
      <img className=' h-[60vh] object-cover' src={productDetails.image} />

      {/* Product Info Section */}
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold mb-2'>
          {productDetails.title}
        </h1>
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-lg font-semibold text-yellow-500'>
            {product.rating} ⭐
          </span>
          <span className='text-gray-500'>
            ({product.reviewsCount} reviews)
          </span>
        </div>
        <h2 className='text-xl sm:text-2xl font-semibold text-red-500 mb-4'>
          ${productDetails.price.toFixed(2)}
        </h2>

        <p className='text-gray-700 mb-2'>{productDetails.description}</p>

        {/* Colors */}
        <div className='mb-4'>
          <p className='font-semibold mb-2'>Select Color:</p>
          <div className='flex gap-2 sm:gap-3'>
            {product.colors.map((color) => (
              <ColorSelector
                key={color}
                color={color}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}

        {/* Quantity and Buttons */}
        <div className='flex flex-wrap gap-4 items-center mb-6'>
          <div className='flex items-center border border-gray-300 rounded-md'>
            <button
              onClick={decrementQuantity}
              className='px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-600'
            >
              -
            </button>
            <span className='px-4 sm:px-6 py-1 sm:py-2'>{quantity}</span>
            <button
              onClick={incrementQuantity}
              className='px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-600'
            >
              +
            </button>
          </div>
          {!presentInCart && (
            <button
              onClick={async () => {
                await postDetails("http://localhost:8080/cart/add", {
                  user: currentUser._id,
                  product_item: productDetails._id,
                });
                setPresentInCart(true);
              }}
              className='bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md shadow-md'
            >
              Add to Cart
            </button>
          )}
          <button className='p-2 sm:p-3 border rounded-md text-gray-600 hover:bg-gray-200'>
            <GoHeart size={20} />
          </button>
        </div>

        {/* Trust Badges */}
        <div className='flex flex-wrap gap-4 items-center mb-4'>
          <div className='flex items-center gap-2'>
            <MdOutlineLocalShipping className='text-green-500' size={20} />
            <span className='text-sm'>Free Shipping</span>
          </div>
          <div className='flex items-center gap-2'>
            <MdVerified className='text-blue-500' size={20} />
            <span className='text-sm'>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

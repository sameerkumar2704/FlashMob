import { useEffect, useState } from "react";
import { GoHeart } from "react-icons/go";
import { MdOutlineLocalShipping, MdVerified } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getDetails, postDetails } from "@/util/fetchHandlers";
import { useSelector } from "react-redux";
import { asyncHandler } from "@/util/asynHandler";

function ProductDetails() {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(undefined);
  const [presentInCart, setPresentInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { currentUser } = useSelector(state => state.global);

  useEffect(
    () => {
      asyncHandler(async () => {
        const res = await getDetails(
          `http://localhost:8080/product?productId=${productId}`
        );
        setProductDetails(res.details);
      })();
    },
    [productId]
  );

  useEffect(
    () => {
      if (!productDetails) return;
      asyncHandler(async () => {
        const res = await getDetails(
          `http://localhost:8080/cart/productIsPresent?user=${currentUser._id}&product_item=${productDetails._id}`
        );
        setPresentInCart(res.productInCart);
        if (res.productInCart) {
          setCartQuantity(res.quantity || quantity);
        }
      })();
    },
    [currentUser._id, productDetails]
  );

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await postDetails("http://localhost:8080/cart/add", {
        user: currentUser._id,
        product_item: productDetails._id,
        quantity: quantity,
      });
      setPresentInCart(true);
      setCartQuantity(quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDescription = description => {
    return description.split("\r\n").filter(Boolean).map((line, index) => {
      const [feature, value] = line.split("-").map(str => str.trim());
      return { feature, value, id: index };
    });
  };

  if (!productDetails)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );

  const discountedPrice = productDetails.onSale
    ? productDetails.price -
      productDetails.price * (productDetails.discount / 100)
    : productDetails.price;

  const descriptionItems = formatDescription(productDetails.description);

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-6 lg:p-8 space-y-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={productDetails.image}
                  alt={productDetails.title}
                  className="w-full h-full object-contain transform transition-transform hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl shadow-sm">
                  <MdOutlineLocalShipping className="text-green-600 text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      Free Shipping
                    </p>
                    <p className="text-xs text-green-700">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl shadow-sm">
                  <MdVerified className="text-blue-600 text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Secure Checkout
                    </p>
                    <p className="text-xs text-blue-700">SSL Encrypted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-6 lg:p-8 bg-gray-50 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {productDetails.category}
                  </span>
                  {productDetails.onSale &&
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full animate-pulse">
                      {productDetails.discount}% OFF
                    </span>}
                </div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {productDetails.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">
                    Brand: {productDetails.brand}
                  </span>
                  <span className="font-medium">
                    Model: {productDetails.model}
                  </span>
                </div>
              </div>

              {productDetails.color &&
                <div className="flex items-center gap-2 py-3 px-4 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Available Color:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: productDetails.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {productDetails.color}
                    </span>
                  </div>
                </div>}

              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {productDetails.onSale &&
                    <span className="text-xl text-gray-500 line-through">
                      ${productDetails.price.toFixed(2)}
                    </span>}
                </div>
                {productDetails.onSale &&
                  <p className="text-sm text-green-600 font-medium">
                    You save: ${(productDetails.price -
                      discountedPrice).toFixed(2)}
                  </p>}
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex items-center justify-center border border-gray-300 rounded-xl bg-white">
                    <button
                      onClick={decrementQuantity}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-xl"
                    >
                      -
                    </button>
                    <span className="w-16 text-center py-3 border-x text-gray-900 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-xl"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] 
                      ${presentInCart
                        ? "bg-green-500"
                        : isLoading
                          ? "bg-red-400 cursor-wait"
                          : "bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl"} text-white`}
                  >
                    {isLoading
                      ? "Adding..."
                      : presentInCart
                        ? `${cartQuantity} ${cartQuantity === 1
                            ? "Item"
                            : "Items"} in Cart`
                        : "Add to Cart"}
                  </button>

                  <button className="p-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 
                      transition-all transform hover:scale-[1.02] bg-white shadow-sm hover:shadow-md">
                    <GoHeart size={24} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <div className="space-y-2">
                  {descriptionItems
                    .slice(0, showFullDescription ? undefined : 3)
                    .map(item =>
                      <div key={item.id} className="flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">
                            {item.feature}
                          </span>
                          {item.value &&
                            <span className="text-gray-600">
                              : {item.value}
                            </span>}
                        </div>
                      </div>
                    )}
                </div>
                {descriptionItems.length > 3 &&
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    {showFullDescription ? "Show Less" : "Read More"}
                  </button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

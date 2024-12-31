import React, { useEffect, useState } from "react";
import { Check, CreditCard, Flag, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getDetails, postDetails } from "@/util/fetchHandlers";
import { useDispatch } from "react-redux";
import { setDialogPage, setStateOfDialogBox } from "@/redux/slice";

const ShoppingCheckout = () => {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [productInCart, setProdutCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddresses] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getSingleProduct() {
      setIsLoading(true);
      const res = await getDetails(
        `http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/product?productId=${searchQuery.get(
          "productId"
        )}`
      );

      setProdutCart({
        list: [{ ...res.details, quantity: searchQuery.get("quantity") }],
      });
      setIsLoading(false);
    }
    async function getCartProducts() {
      setIsLoading(true);
      const res = await getDetails(
        "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/cart/all"
      );
      setProdutCart({ list: res.list });
      setIsLoading(false);
    }
    if (searchQuery.get("type") === "product") {
      getSingleProduct();
    } else {
      getCartProducts();
    }
  }, []);
  useEffect(() => {
    async function getAddressList() {
      const res = await getDetails(
        "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/address/"
      );
      setAddresses(res.list.address);
      if (!shippingAddress) {
        res.list.address.forEach((curr) => {
          if (curr.isDefault) setShippingAddress(curr._id);
        });
      }
    }
    getAddressList();
  }, [refetch, shippingAddress]);

  const [showAddresses, setShowAddresses] = useState(false);

  const calculateTotal = () => {
    return productInCart.list.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  if (isLoading) return <h1>Loadding..</h1>;

  return (
    <div className='w-full max-w-4xl mx-auto p-4'>
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <h1 className='text-2xl font-semibold mb-8'>Checkout</h1>

        {/* Cart Items */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
          <div className='space-y-4  max-h-96 overflow-y-scroll'>
            {productInCart.list.map((item) => (
              <div
                key={item.id}
                className='flex justify-between items-center border-b pb-4'
              >
                <div>
                  <img
                    className=' w-14 h-14 object-contain rounded-md'
                    src={item.image}
                  />
                  <h3 className='font-medium line-clamp-3 max-w-52'>
                    {item.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className='font-medium'>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className='flex justify-between items-center pt-4'>
              <span className='font-semibold'>Total:</span>
              <span className='font-semibold'>
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Shipping Address</h2>

          {/* Default Address Card */}
          {address.map((addressObj) => (
            <>
              <div
                onClick={() => setShippingAddress(addressObj._id)}
                className='border rounded-lg p-4 mb-4'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className=' border p-1 rounded-full border-red-500'>
                      <div
                        className={` w-3 h-3 rounded-full ${
                          shippingAddress === addressObj._id && "bg-red-600"
                        }`}
                      ></div>
                    </div>

                    <MapPin className='text-red-600 mt-1' size={20} />
                    <div>
                      <div className='text-gray-600 flex gap-2'>
                        <h1>{addressObj.houseNo} </h1>
                        <h1>{addressObj.street}</h1>
                      </div>
                      <div className='text-gray-600'>
                        {addressObj.city}, {addressObj.state} {addressObj.zip}
                      </div>
                      {addressObj.isDefault && (
                        <span className='inline-block mt-2 text-sm text-red-600 font-medium'>
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}

          {/* Change Address Button */}
          <button
            onClick={() => setShowAddresses(!showAddresses)}
            className='text-red-600 font-medium hover:text-red-700'
          >
            Change delivery address
          </button>

          {/* Other Addresses */}
          {showAddresses && (
            <div className='mt-4 space-y-4'>
              {savedAddresses
                .filter((addr) => !addr.isDefault)
                .map((address) => (
                  <div
                    key={address.id}
                    className='border rounded-lg p-4 hover:border-red-600 cursor-pointer'
                  >
                    <div className='flex items-start space-x-3'>
                      <MapPin className='text-gray-400 mt-1' size={20} />
                      <div>
                        <div className='font-medium '>{address.name}</div>
                        <div className='text-gray-600'>{address.street}</div>
                        <div className='text-gray-600'>
                          {address.city}, {address.state} {address.zip}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 p-4 border rounded'>
              <CreditCard className='text-red-600' />
              <span>Credit Card</span>
            </div>
            <input
              type='text'
              placeholder='Card Number'
              className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500'
            />
            <div className='grid grid-cols-2 gap-4'>
              <input
                type='text'
                placeholder='MM/YY'
                className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500'
              />
              <input
                type='text'
                placeholder='CVV'
                className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500'
              />
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={async () => {
            await postDetails(
              "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/orders",
              {
                products: productInCart.list,
                address: shippingAddress,
                amount: calculateTotal().toFixed(2),
              }
            );
            dispatch(setStateOfDialogBox(true));
            dispatch(setDialogPage("Order Confromation"));
          }}
          className='w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium'
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ShoppingCheckout;

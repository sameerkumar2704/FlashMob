import React, { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, ShoppingBasket } from "lucide-react";
import { Link, useLoaderData } from "react-router-dom";
import { deleteItem, postDetails } from "@/util/fetchHandlers";

const ShoppingCart = () => {
  const { list } = useLoaderData();
  const [products, setProducts] = useState(list);

  const updateQuantity = async (id, change) => {
    let quantity = 1;
    setProducts(
      products.map((product) => {
        if (product._id === id) {
          const newQuantity = Math.max(1, product.quantity + change);
          quantity = newQuantity;
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
    await postDetails("http://localhost:8080/cart/add", {
      product_item: id,

      quantity,
    });
  };

  const removeProduct = async (id) => {
    await deleteItem(`/api/cart?productId=${id}`);
    setProducts(products.filter((product) => product._id !== id));
  };

  const total = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const EmptyCart = () => (
    <div className='text-center py-12'>
      <div className='flex justify-center mb-4'>
        <ShoppingBasket size={64} className='text-red-200' />
      </div>
      <h2 className='text-xl font-semibold mb-2'>Your Cart is Empty</h2>
      <p className='text-sm text-gray-500 mb-8'>
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link
        to='/'
        className='bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors'
      >
        Continue Shopping
      </Link>
    </div>
  );

  // Mobile Product Card
  const ProductCard = ({ product }) => (
    <div className='flex gap-4 p-4 border-b'>
      <img
        src={product.image}
        alt={product.title}
        className='w-20 h-20 object-contain rounded flex-shrink-0'
      />
      <div className='flex-1 min-w-0'>
        <h3 className='text-sm text-gray-600 leading-snug line-clamp-2 mb-1'>
          {product.title}
        </h3>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm text-red-600 font-medium'>
            ${product.price}
          </span>
          <button
            onClick={() => removeProduct(product.id)}
            className='text-gray-400 hover:text-red-600 transition-colors'
            aria-label='Remove item'
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => updateQuantity(product._id, -1)}
            className='p-1 rounded-full hover:bg-red-50 text-red-600'
          >
            <Minus size={16} />
          </button>
          <span className='w-8 text-center text-sm font-medium'>
            {product.quantity}
          </span>
          <button
            onClick={() => updateQuantity(product._id, 1)}
            className='p-1 rounded-full hover:bg-red-50 text-red-600'
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='max-w-6xl mx-auto p-4'>
      {products.length === 0 ? (
        <div className='bg-white rounded-lg p-6'>
          <EmptyCart />
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-lg'>
          <div className='flex flex-col h-[calc(100vh-2rem)]'>
            <div className='p-4 md:p-6'>
              <h1 className='text-xl text-gray-700 flex items-center gap-2'>
                <ShoppingBag className='text-red-600' />
                Shopping Cart ({products.length} items)
              </h1>
            </div>

            {/* Mobile View */}
            <div className='md:hidden flex-1 overflow-auto'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Desktop View */}
            <div className='hidden md:block flex-1 overflow-auto px-6'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b sticky top-0'>
                  <tr>
                    <th className='p-4 text-left w-1/2 text-gray-600 text-sm font-medium'>
                      Product
                    </th>
                    <th className='p-4 text-right whitespace-nowrap text-gray-600 text-sm font-medium'>
                      Price
                    </th>
                    <th className='p-4 text-center whitespace-nowrap text-gray-600 text-sm font-medium'>
                      Quantity
                    </th>
                    <th className='p-4 text-right whitespace-nowrap text-gray-600 text-sm font-medium'>
                      Total
                    </th>
                    <th className='p-4 w-16'></th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {products.map((product) => (
                    <tr key={product.id} className='hover:bg-gray-50'>
                      <td className='p-4'>
                        <div className='flex items-start gap-4'>
                          <img
                            src={product.image}
                            alt={product.title}
                            className='w-14 h-14 object-contain rounded flex-shrink-0'
                          />
                          <span className='text-sm text-gray-600 leading-snug line-clamp-2'>
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className='p-4 text-right'>
                        <span className='text-sm text-red-600 font-medium whitespace-nowrap'>
                          ${product.price}
                        </span>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center justify-center gap-2'>
                          <button
                            onClick={() => updateQuantity(product._id, -1)}
                            className='p-1 rounded-full hover:bg-red-50 text-red-600'
                          >
                            <Minus size={16} />
                          </button>
                          <span className='w-8 text-center text-sm font-medium'>
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, 1)}
                            className='p-1 rounded-full hover:bg-red-50 text-red-600'
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                      <td className='p-4 text-right text-sm font-semibold whitespace-nowrap'>
                        ${(product.price * product.quantity).toFixed(2)}
                      </td>
                      <td className='p-4 text-center'>
                        <button
                          onClick={() => removeProduct(product._id)}
                          className='p-2 text-gray-400 hover:text-red-600 transition-colors'
                          aria-label='Remove item'
                        >
                          ,
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='p-4 md:p-6 border-t bg-white'>
              <div className='flex justify-between items-center mb-4'>
                <div className='space-y-1'>
                  <p className='text-base text-gray-700'>Total Amount</p>
                  <p className='text-xs text-gray-500'>Including all taxes</p>
                </div>
                <span className='text-xl font-bold text-red-600'>
                  ${total.toFixed(2)}
                </span>
              </div>

              <button className='w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors'>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

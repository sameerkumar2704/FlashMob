import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { getDetails } from "@/util/fetchHandlers";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function getOrders() {
      const data = await getDetails(
        "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8080/orders"
      );
      setOrders(data.orders);
    }
    getOrders();
  }, []);

  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };
  if (orders.length === 0) return;
  return (
    <div className='w-full max-w-3xl mx-auto p-2 md:p-4 space-y-4'>
      <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black'>
        Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className='border border-red-500 rounded-lg shadow-sm overflow-hidden'
        >
          <div
            className='p-3 md:p-4 flex justify-between items-center cursor-pointer hover:bg-red-50 transition-colors'
            onClick={() => toggleOrder(order._id)}
          >
            <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-4'>
              <span className='font-medium text-black text-lg'>
                Order #{order._id}
              </span>
              <span className='text-red-600 font-medium text-lg'>
                ${order.amount}
              </span>
            </div>
            {expandedOrders.has(order._id) ? (
              <ChevronUp className='h-6 w-6 text-red-500' />
            ) : (
              <ChevronDown className='h-6 w-6 text-red-500' />
            )}
          </div>

          {expandedOrders.has(order._id) && (
            <div className='border-t border-red-200 px-3 py-2 md:px-4 md:py-3'>
              {/* Delivery Address Section */}
              <div className='mb-6 p-4 bg-red-50 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <MapPin className='h-5 w-5 text-red-500' />
                  <h3 className='text-lg font-medium text-black'>
                    Delivery Address
                  </h3>
                </div>
              </div>

              {/* Items Section */}
              <div className='space-y-4'>
                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className='border-b border-red-100 pb-4 last:border-b-0'
                  >
                    <div className='flex gap-4'>
                      <img
                        src={item._id.image}
                        alt={item._id.title}
                        className='w-20 h-20 object-contain rounded-lg border border-red-200'
                      />
                      <div className='flex-1'>
                        <h3 className=' text-sm line-clamp-2 font-medium text-black mb-2'>
                          {item._id.title}
                        </h3>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                          <div>
                            <span className='text-sm text-gray-600'>
                              Quantity:
                            </span>
                            <span className='ml-2 text-black font-medium'>
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span className='text-sm text-gray-600'>
                              Price:
                            </span>
                            <span className='ml-2 text-black font-medium'>
                              ${item._id.price}
                            </span>
                          </div>
                          <div className='col-span-2 md:col-span-1'>
                            <span className='text-sm text-gray-600'>
                              Total:
                            </span>
                            <span className='ml-2 text-red-600 font-medium'>
                              ${item.quantity * item._id.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='flex justify-end pt-2 border-t border-red-200'>
                  <div className='text-lg font-medium'>
                    <span className='text-black'>Order Total:</span>
                    <span className='ml-2 text-red-600'>
                      ${order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { OrderList };

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setDialogPage, setStateOfDialogBox } from "@/redux/slice";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, getDetails, postDetails } from "@/util/fetchHandlers";
import { asyncHandler } from "@/util/asynHandler";
import { useToast } from "@/hooks/use-toast";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function getOrderList() {
      const res = await getDetails(
        "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/orders/?limit=3"
      );
      setOrders(res.orders);
    }
    getOrderList();
  }, []);
  if (orders.length === 0) return;
  function getDate(isoDate) {
    const date = new Date(isoDate);
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  }

  return (
    <Card className='border-red-200 min-w-72   overflow-hidden'>
      <CardHeader className='bg-red-50'>
        <CardTitle className='flex items-center text-red-900'>
          <Package className='w-5 h-5 mr-2 text-red-600' />
          Recent Orders
          {orders.length == 3 && (
            <Button
              onClick={() => navigate("/orders")}
              className='ml-auto mr-4 bg-red-500 hover:bg-red-700'
            >
              View All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4 p-2'>
          {orders.length === 0 && <h1>No recent orders found</h1>}
          {orders.map((order) => (
            <div
              key={order._id}
              className='flex justify-between items-center p-4 border border-red-200 rounded hover:bg-red-50'
            >
              <div className='space-y-1'>
                <p className='font-medium text-red-900'>Order #{order._id}</p>
                <p className='text-sm text-red-600'>
                  {getDate(order.createdAt)}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-medium text-red-900'>${order.amount}</p>
                <p className='text-sm text-red-600'>{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const UserAddress = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { isDataLoading } = useSelector((state) => state.global);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [formData, setFormData] = useState({
    type: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const [refetch, setRefetch] = useState(false);
  const [addresses, setAddresses] = useState(undefined);
  const handleSubmit = asyncHandler(async (e) => {
    e.preventDefault();
    const res = await postDetails(
      "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/address/",
      formData
    );
    if (res.status === 304) {
      throw new Error("No Update in Address");
    }
    setRefetch((curr) => !curr);

    resetForm();
  }, toast);

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr._id !== id));
    deleteItem(
      `https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/address/${id}`
    );
  };

  const resetForm = () => {
    setFormData({
      type: "",
      street: "",
      apt: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const setDefaultAddress = async (formData) => {
    const res = await postDetails(
      "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/address/",
      formData
    );
    if (res.status === 304) {
      throw new Error("No Update in Address");
    }
    setRefetch((curr) => !curr);
  };
  useEffect(() => {
    async function getAddressList() {
      const res = await getDetails(
        "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/address/"
      );
      setAddresses(res.list.address);
    }
    getAddressList();
  }, [refetch, isDataLoading]);
  if (!addresses)
    return (
      <div className='flex items-center justify-center border-red-200 overflow-hidden min-w-96 bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500' />
      </div>
    );
  return (
    <Card className='border-red-200 overflow-hidden min-w-96'>
      <CardHeader className='bg-red-50 flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center text-red-900'>
          <MapPin className='w-5 h-5 mr-2 text-red-600' />
          Addresses
        </CardTitle>
        {addresses.length < 2 && (
          <Button
            className='bg-red-600 hover:bg-red-700 text-white'
            onClick={() => {
              dispatch(setStateOfDialogBox(true));
              dispatch(setDialogPage("New Address"));
            }}
          >
            Add Address
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-4 o'>
        {/* Address List */}
        <div className='space-y-4 w-96 p-2'>
          {addresses.length === 0 && (
            <h1>No address is found for delivery please add One</h1>
          )}
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg ${
                address.isDefault
                  ? "border-red-500 bg-red-50"
                  : "hover:bg-red-50 border-red-200"
              }`}
            >
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-red-900'>
                      {address.houseNo}
                    </span>
                    {address.isDefault && (
                      <span className='text-xs bg-red-100 text-red-800 px-2 py-1 rounded'>
                        Default
                      </span>
                    )}
                  </div>
                  <p>{address.street}</p>

                  {address.houseNo && <p>{address.houseNO}</p>}
                  <p>{`${address.city}, ${address.state} ${address.zipcode}`}</p>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-red-600 hover:text-red-700 hover:bg-red-100'
                    onClick={() => handleEdit(address)}
                  >
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-100'
                        onClick={() =>
                          setDefaultAddress({ ...address, isDefault: true })
                        }
                      >
                        Set Default
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-100'
                        onClick={() => handleDelete(address._id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Address Form */}
        {showAddressForm && (
          <form
            onSubmit={handleSubmit}
            className='mt-4 p-4 border border-red-200 rounded-lg bg-red-50'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <input
                  type='text'
                  name='street'
                  placeholder='Street Address'
                  value={formData.street}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-red-200 rounded focus:ring-red-500 focus:border-red-500'
                  required
                />
              </div>
              <input
                type='text'
                name='apt'
                placeholder='Apt/Suite (optional)'
                value={formData.houseNo}
                onChange={handleInputChange}
                className='w-full p-2 border border-red-200 rounded focus:ring-red-500 focus:border-red-500'
              />
              <input
                type='text'
                name='city'
                placeholder='City'
                value={formData.city}
                onChange={handleInputChange}
                className='w-full p-2 border border-red-200 rounded focus:ring-red-500 focus:border-red-500'
                required
              />
              <input
                type='text'
                name='state'
                placeholder='State'
                value={formData.state}
                onChange={handleInputChange}
                className='w-full p-2 border border-red-200 rounded focus:ring-red-500 focus:border-red-500'
                required
              />
              <input
                type='text'
                name='zip'
                placeholder='ZIP Code'
                value={formData.zipcode}
                onChange={handleInputChange}
                className='w-full p-2 border border-red-200 rounded focus:ring-red-500 focus:border-red-500'
                required
              />
              <div className='col-span-2'>
                <label className='flex items-center space-x-2 text-red-900'>
                  <input
                    type='checkbox'
                    name='isDefault'
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className='rounded border-red-300 text-red-600 focus:ring-red-500'
                  />
                  <span>Set as default address</span>
                </label>
              </div>
            </div>
            <div className='mt-4 flex gap-2'>
              <Button
                type='submit'
                className='bg-red-600 hover:bg-red-700 text-white'
              >
                {editingAddressId ? "Update Address" : "Save Address"}
              </Button>
              <Button
                type='button'
                variant='outline'
                className='border-red-600 text-red-600 hover:bg-red-50'
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
const ProfilePage = () => {
  const [detail, setDetails] = useState(undefined);
  useEffect(() => {
    async function getAboutUser() {
      const res = await getDetails(
        "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/"
      );
      setDetails(res.detail);
    }
    getAboutUser();
  }, []);
  if (!detail)
    return (
      <div className='flex items-center justify-center h-[calc(100vh-4rem)] bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500' />
      </div>
    );

  return (
    <div className=' flex flex-col items-center p-4 space-y-6'>
      {/* Personal Information Card */}
      <Card className=' overflow-hidden w-fit border-red-200'>
        <CardHeader className='bg-red-50'>
          <CardTitle className='text-red-900'>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-red-600'>Name</label>
              <p className='text-lg'>{detail.username}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-red-600'>Email</label>
              <p className='text-lg'>{detail.email}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-red-600'>Phone</label>
              <p className='text-lg'>{detail.phonenumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <div className=' flex gap-10 flex-wrap '>
        <UserAddress />
        <RecentOrders />
      </div>
    </div>
  );
};

export { ProfilePage };

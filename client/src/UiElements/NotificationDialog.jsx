import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  currentUserInstance,
  loadingState,
  setDialogPage,
  setStateOfDialogBox,
  setToastMessage,
} from "@/redux/slice";
import { asyncHandler } from "@/util/asynHandler";
import { postDetails, patchDetails } from "@/util/fetchHandlers";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const context = createContext(undefined);
const useNotificiationContext = () => {
  const data = useContext(context);
  if (!data) throw new Error("Notification Context Not Found");
  return data;
};
const NotificationBox = ({ title, children }) => {
  const { showDialogBox } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const { page } = useSelector((state) => state.global);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(false);
  }, [showDialogBox]);

  if (!showDialogBox) return;

  return (
    <context.Provider
      value={{
        title,
        children,
        setAnimate,
      }}
    >
      <div
        className={`  transition-all flex justify-center items-center fixed bg-black/40 z-10 left-0 right-0 bottom-0 top-0 duration-200`}
      >
        <div
          className={` w-[30vw] max-lg:w-[60vw] max-sm:w-[90vw] bg-white duration-200 transition ${
            animate ? "animate-out" : "animate-in "
          }`}
        >
          <div className=' flex justify-center mb-4 border-b-2 border-gray-100 p-3 '>
            <MdCancel
              onClick={() => {
                setAnimate(true);
                setTimeout(() => dispatch(setStateOfDialogBox(false)), 200);
              }}
              className=' w-6 h-6  mr-auto'
            />
            <span className=' mr-auto text-sm font-semibold tracking-wider'>
              {page}
            </span>
          </div>

          {children}
        </div>
      </div>
    </context.Provider>
  );
};
const RegistaionForm = () => {
  const dispatch = useDispatch();
  const { isOutline, setAnimate } = useNotificiationContext();
  const { page } = useSelector((state) => state.global);
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const phonenumber = useRef();
  const { toast } = useToast();
  if (page.toLowerCase() !== "registration") return;
  return (
    <div className=' mt-2 p-3'>
      <h1 className=' tracking-wider font-semibold'>Welcome to FlashMob</h1>
      <h1 className=' mt-4 tracking-wider text-gray-500 font-light'>
        Create a Account
      </h1>
      <form className=' space-y-2 mt-4'>
        <Input ref={userName} placeholder='User Name' />

        <Input ref={email} placeholder='Email' />
        <Input ref={password} placeholder='Password' />
        <Input ref={phonenumber} type='number' placeholder='Phone No.' />
      </form>
      <Button
        onClick={asyncHandler(async () => {
          const obj = {
            username: userName.current.value,
            password: password.current.value,
            email: email.current.value,
            phonenumber: phonenumber.current.value,
          };

          const result = await postDetails(
            "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/register",
            obj
          );
          if (result.status === "failed") throw new Error(result.message);

          const userDetail = await postDetails(
            "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/login",
            obj
          );

          if (userDetail.status === "failed") throw new Error(result.message);
          setAnimate(true);
          setTimeout(() => {
            dispatch(currentUserInstance(JSON.parse(userDetail.detail)));
            dispatch(setStateOfDialogBox(false));
          }, 200);
          dispatch(setToastMessage("Account is Created"));
        }, toast)}
        className={` mt-10 py-2  w-full hover:bg-red-500/90 
          ${isOutline ? "border border-red-500" : "bg-red-500"}`}
      >
        Sign Up
      </Button>
      <div className=' w-full  bg-gray-200 h-[1px] mt-5 rounded-full  ' />
      <div className=' mt-5 space-y-3'>
        <h1 className=' flex justify-center text-gray-400 text-sm'>
          <span> Already have account ? </span>

          <button
            onClick={() => dispatch(setDialogPage("log in"))}
            className=' text-red-600 mx-4 text-sm hover:text-red-400'
          >
            Sign In
          </button>
        </h1>
      </div>
    </div>
  );
};
const LoginInForm = () => {
  const dispatch = useDispatch();
  const { isOutline, setAnimate } = useNotificiationContext();
  const { page } = useSelector((state) => state.global);

  const email = useRef();
  const password = useRef();

  const { toast } = useToast();
  if (page.toLowerCase() !== "log in") return;
  return (
    <div className=' mt-2 p-3'>
      <h1 className=' tracking-wider font-semibold'>Welcome to FlashMob</h1>
      <h1 className=' mt-4 tracking-wider text-gray-500 font-light'>
        Login In
      </h1>
      <form className=' space-y-2 mt-4'>
        <Input ref={email} placeholder='Email' />
        <Input ref={password} placeholder='Password' />
      </form>
      <button
        onClick={() => dispatch(setDialogPage("forgotpassword"))}
        className=' text-sm text-red-400 mx-1 my-2 hover:text-red-300'
      >
        forgot password ?
      </button>
      <Button
        onClick={asyncHandler(async () => {
          const obj = {
            password: password.current.value,
            email: email.current.value,
          };

          let userDetail = await postDetails(
            "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/login",
            obj
          );
          if (userDetail.status === "failed")
            throw new Error(userDetail.message);

          setAnimate(true);
          setTimeout(() => {
            dispatch(currentUserInstance(JSON.parse(userDetail.detail)));
            dispatch(setStateOfDialogBox(false));
          }, 200);
          dispatch(setToastMessage("Login Completed"));
        }, toast)}
        className={` mt-10 py-2  w-full hover:bg-red-500/90 
          ${isOutline ? "border border-red-500" : "bg-red-500"}`}
      >
        Sign In
      </Button>
      <div className=' w-full  bg-gray-200 h-[1px] mt-5 rounded-full  ' />
      <div className=' mt-5 space-y-3'>
        <h1 className=' flex justify-center text-gray-400 text-sm'>
          <span> Already have account ? </span>

          <button
            onClick={() => dispatch(setDialogPage("registration"))}
            className=' text-red-600 mx-4 hover:text-red-400'
          >
            Create New Account
          </button>
        </h1>
      </div>
    </div>
  );
};
const AddNewAddress = () => {
  const { page } = useSelector((state) => state.global);
  const zipcode = useRef();
  const city = useRef();
  const state = useRef();
  const street = useRef();
  const houeNo = useRef();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOutline, setAnimate } = useNotificiationContext();
  if (page.toLowerCase() !== "new address") return;
  return (
    <form
      className=' p-4 flex flex-col gap-4'
      onSubmit={asyncHandler(async (e) => {
        e.preventDefault();
        console.log("clicked");
        const resp = await postDetails(
          "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/address/add",
          {
            houseNo: houeNo.current.value,
            zipcode: zipcode.current.value,
            street: street.current.value,
            state: state.current.value,
            city: city.current.value,
          }
        );
        setAnimate(true);
        setTimeout(() => {
          dispatch(setStateOfDialogBox(false));
        }, 200);
        dispatch(loadingState(true));
        dispatch(setToastMessage("Address is Added"));
      }, toast)}
    >
      <Input required ref={houeNo} placeholder='House No' />
      <Input required ref={street} placeholder='Street Address' />
      <Input required ref={city} placeholder='City' />
      <Input required ref={state} placeholder='State' />
      <Input required ref={zipcode} placeholder='Zipcode' />
      <Button
        className={` mt-10 py-2  w-full hover:bg-red-500/90 
          ${isOutline ? "border border-red-500" : "bg-red-500"}`}
      >
        Add Address
      </Button>
    </form>
  );
};
const OrderConformation = () => {
  const dispatch = useDispatch();
  const { setAnimate } = useNotificiationContext();
  const { page } = useSelector((state) => state.global);
  const navigation = useNavigate();
  useEffect(() => {
    if (page.toLowerCase() !== "order confromation") return;
    setTimeout(() => {
      setAnimate(true);
      setTimeout(() => {
        dispatch(setStateOfDialogBox(false));
      }, 200);
    }, 1500);
    navigation("/");
  }, []);
  if (page.toLowerCase() !== "order confromation") return;
  return (
    <div className='text-center mb-8'>
      <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>
        Order Confirmed!
      </h1>
      <p className='text-gray-600'>Thank you for your purchase</p>
    </div>
  );
};

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isOutline } = useNotificiationContext();
  const { page } = useSelector((state) => state.global);
  const email = useRef();
  const { toast } = useToast();

  if (page.toLowerCase() !== "forgotpassword") return null;

  return (
    <div className='mt-2 p-3'>
      <h1 className='tracking-wider font-semibold'>Forgot Password</h1>
      <h1 className='mt-4 tracking-wider text-gray-500 font-light'>
        Enter your email to reset password
      </h1>
      <form className='space-y-2 mt-4'>
        <Input ref={email} placeholder='Email' />
      </form>
      <Button
        onClick={asyncHandler(async () => {
          try {
            if (!email.current.value.includes("@")) {
              throw new Error("Please provide a valid email address");
            }
            const obj = {
              email: email.current.value,
            };

            const result = await postDetails(
              "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/forgotPassword",
              obj
            );
            if (result.status === "failed") throw new Error(result.message);

            // Success case - change dialog to reset password
            dispatch(setToastMessage("Reset link sent to your email"));
            dispatch(setDialogPage("resetpassword"));
          } catch (error) {
            // Error case
            toast({
              title: "Error",
              description: error.message || "Failed to send reset link",
              variant: "destructive",
            });
            // Return to login dialog
            dispatch(setDialogPage("log in"));
          }
        }, toast)}
        className={`mt-10 py-2 w-full hover:bg-red-500/90 ${
          isOutline ? "border border-red-500" : "bg-red-500"
        }`}
      >
        Send Reset Link
      </Button>
      <div className='w-full bg-gray-200 h-[1px] mt-5 rounded-full' />
      <div className='mt-5 space-y-3'>
        <h1 className='flex justify-center text-gray-400 text-sm'>
          <span>Remember your password?</span>
          <button
            onClick={() => dispatch(setDialogPage("log in"))}
            className='text-red-600 mx-4 hover:text-red-400'
          >
            Sign In
          </button>
        </h1>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { isOutline, setAnimate } = useNotificiationContext();
  const { page } = useSelector((state) => state.global);
  const password = useRef();
  const confirmPassword = useRef();
  const resetToken = useRef();
  const { toast } = useToast();

  if (page.toLowerCase() !== "resetpassword") return null;

  return (
    <div className='mt-2 p-3'>
      <h1 className='tracking-wider font-semibold'>Reset Password</h1>
      <h1 className='mt-4 tracking-wider text-gray-500 font-light'>
        Enter your new password
      </h1>
      <form className='space-y-2 mt-4'>
        <Input type='text' ref={resetToken} placeholder='Token' />
        <Input type='password' ref={password} placeholder='New Password' />
        <Input
          type='password'
          ref={confirmPassword}
          placeholder='Confirm Password'
        />
      </form>
      <Button
        onClick={asyncHandler(async () => {
          try {
            if (!resetToken) {
              throw new Error("Reset token not found");
            }

            if (password.current.value !== confirmPassword.current.value) {
              throw new Error("Passwords do not match");
            }

            const result = await patchDetails(
              `https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/resetPassword/${resetToken.current.value}`,
              {
                password: password.current.value,
              }
            );

            if (result.status === "failed") throw new Error(result.message);

            // Success case
            dispatch(
              setToastMessage(
                "Password reset successful. Please login with your new password."
              )
            );
            // Change dialog to login
            dispatch(setDialogPage("log in"));
          } catch (error) {
            // Error case
            toast({
              title: "Error",
              description: error.message || "Failed to reset password",
              variant: "destructive",
            });
            // Return to login dialog
            dispatch(setDialogPage("log in"));
          }
        }, toast)}
        className={`mt-10 py-2 w-full hover:bg-red-500/90 ${
          isOutline ? "border border-red-500" : "bg-red-500"
        }`}
      >
        Reset Password
      </Button>
      <div className='mt-5 space-y-3'>
        <h1 className='flex justify-center text-gray-400 text-sm'>
          <span>Want to try logging in?</span>
          <button
            onClick={() => dispatch(setDialogPage("log in"))}
            className='text-red-600 mx-4 hover:text-red-400'
          >
            Sign In
          </button>
        </h1>
      </div>
    </div>
  );
};

NotificationBox.Registration = RegistaionForm;
NotificationBox.Login = LoginInForm;
NotificationBox.AddNewAddress = AddNewAddress;
NotificationBox.OrderConformation = OrderConformation;
NotificationBox.ForgotPassword = ForgotPassword;
NotificationBox.ResetPassword = ResetPassword;

export { NotificationBox };

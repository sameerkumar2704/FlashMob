import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalContext } from "@/context/globaleContext";
import { useUserContext } from "@/context/usercontex";
import { useToast } from "@/hooks/use-toast";
import { asyncHandler } from "@/util/asynHandler";
import { getDetails, postDetails } from "@/util/fetchHandlers";
import { Flag } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdCancel } from "react-icons/md";

const context = createContext(undefined);
const useNotificiationContext = () => {
  const data = useContext(context);
  if (!data) throw new Error("Notification Context Not Found");
  return data;
};
const NotificationBox = ({ title, children }) => {
  const [page, setPage] = useState(title);
  const { setShow, show } = useGlobalContext();
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(false);
  }, [show]);

  if (!show) return;

  return (
    <context.Provider
      value={{ title, children, setAnimate, setShow, page, setPage }}
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
                setTimeout(() => setShow(false), 200);
              }}
              className=' w-6 h-6  mr-auto'
            />
            <span className=' mr-auto text-sm font-semibold tracking-wider'>
              {title}
            </span>
          </div>

          {children}
        </div>
      </div>
    </context.Provider>
  );
};
const RegistaionForm = () => {
  const { setCurrentUser } = useUserContext();
  const { isOutline, setAnimate, setShow, page, setPage } =
    useNotificiationContext();
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const phonenumber = useRef();
  const { toast } = useToast();
  if (page.toLowerCase() !== "registration") return;
  return (
    <div className=' mt-2 p-3'>
      <h1 className=' tracking-wider font-semibold'>Welcome to Airbnb</h1>
      <h1 className=' mt-4 tracking-wider text-gray-300 font-light'>
        Create a Account
      </h1>
      <form className=' space-y-2 mt-4'>
        <Input ref={userName} placeholder='User Name' />

        <Input ref={email} placeholder='Email' />
        <Input ref={password} placeholder='Password' />
        <Input ref={phonenumber} type='number' placeholder='User Name' />
      </form>
      <Button
        onClick={asyncHandler(async () => {
          const obj = {
            username: userName.current.value,
            password: password.current.value,
            email: email.current.value,
            phonenumber: phonenumber.current.value,
          };

          const result = await postDetails("/api/users/register", obj);
          if (result.status === "failed") throw new Error(result.message);

          const userDetial = await postDetails("/api/users/login", obj);

          if (userDetial.status === "failed") throw new Error(result.message);
          setAnimate(true);
          setTimeout(() => {
            setCurrentUser(JSON.parse(userDetial.userDetail));
            setShow(false);
          }, 200);
          toast({
            duration: 1000,
            description: "Sign Up complete.",
          });
        }, toast)}
        className={` mt-10 py-2  w-full hover:bg-red-500/90 
          ${isOutline ? "border border-red-500" : "bg-red-500"}`}
      >
        Sign Up
      </Button>
      <div className=' w-full  bg-gray-200 h-[1px] mt-5 rounded-full  '></div>
      <div className=' mt-5 space-y-3'>
        <button className=' text-sm w-full flex border px-3 py-1 justify-center gap-1 items-center '>
          <h1>Login With Google</h1>
          <FcGoogle className=' w-6 h-6' />
        </button>
        <h1 className=' flex justify-center text-gray-400 text-sm'>
          <span> Already have account ? </span>

          <button
            onClick={() => setPage("Log In")}
            className=' text-gray-600 mx-4'
          >
            sign in
          </button>
        </h1>
      </div>
    </div>
  );
};
const LoginInForm = () => {
  const { setCurrentUser } = useUserContext();
  const { isOutline, setAnimate, setShow, page, setPage } =
    useNotificiationContext();

  const email = useRef();
  const password = useRef();

  const { toast } = useToast();
  if (page.toLowerCase() !== "log in") return;
  return (
    <div className=' mt-2 p-3'>
      <h1 className=' tracking-wider font-semibold'>Welcome to Airbnb</h1>
      <h1 className=' mt-4 tracking-wider text-gray-300 font-light'>
        Login In
      </h1>
      <form className=' space-y-2 mt-4'>
        <Input ref={email} placeholder='Email' />
        <Input ref={password} placeholder='Password' />
      </form>
      <Button
        onClick={asyncHandler(async () => {
          const obj = {
            password: password.current.value,
            email: email.current.value,
          };

          let userDetial = await postDetails("/api/users/login", obj);
          if (userDetial.status === "failed")
            throw new Error(userDetial.message);

          setAnimate(true);
          setTimeout(() => {
            setCurrentUser(JSON.parse(userDetial.userDetail));
            setShow(false);
          }, 200);
          toast({
            duration: 1000,
            description: "Sign Up complete.",
          });
        }, toast)}
        className={` mt-10 py-2  w-full hover:bg-red-500/90 
          ${isOutline ? "border border-red-500" : "bg-red-500"}`}
      >
        Sign Up
      </Button>
      <div className=' w-full  bg-gray-200 h-[1px] mt-5 rounded-full  '></div>
      <div className=' mt-5 space-y-3'>
        <button className=' text-sm w-full flex border px-3 py-1 justify-center gap-1 items-center '>
          <h1>Login With Google</h1>
          <FcGoogle className=' w-6 h-6' />
        </button>
        <h1 className=' flex justify-center text-gray-400 text-sm'>
          <span> Already have account ? </span>

          <button
            onClick={() => setPage("Registration")}
            className=' text-gray-600 mx-4'
          >
            Create New Account
          </button>
        </h1>
      </div>
    </div>
  );
};
NotificationBox.Registration = RegistaionForm;
NotificationBox.Login = LoginInForm;
export { NotificationBox };

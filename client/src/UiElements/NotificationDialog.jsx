import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useUserContext } from "@/context/usercontex";
import { useToast } from "@/hooks/use-toast";
import { asyncHandler } from "@/util/asynHandler";
import { createContext, useContext, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdCancel } from "react-icons/md";

const context = createContext(undefined);
const useNotificiationContext = () => {
  const data = useContext(context);
  if (!data) throw new Error("Notification Context Not Found");
  return data;
};
const NotificationBox = ({ isOpen, title, children }) => {
  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  if (!isOpen) return;

  return (
    <context.Provider value={{ isOpen, title, children }}>
      <div
        className={`  transition-all flex justify-center items-center fixed bg-black/40 z-10 left-0 right-0 bottom-0 top-0 duration-200`}
      >
        <div
          className={` w-[30vw] max-lg:w-[60vw] max-sm:w-[90vw] bg-white duration-200 ${
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
  const { isOutline } = useNotificiationContext();
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const phonenumber = useRef();
  const { toast } = useToast();
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

          const res = await fetch("http://localhost:8080/users/register", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" },
          });
          const result = await res.json();
          console.log(result);
          if (result.status === "failed") throw new Error(result.message);
          const loginUser = await fetch("http://localhost:8080/users/login", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          const userDetial = await loginUser.json();
          if (userDetial.status === "failed") throw new Error(result.message);
          setCurrentUser(JSON.parse(userDetial.userDetail));
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

          <button className=' text-gray-600 mx-4'> sign in</button>
        </h1>
      </div>
      <Toaster />
    </div>
  );
};
NotificationBox.Registration = RegistaionForm;
export { NotificationBox };

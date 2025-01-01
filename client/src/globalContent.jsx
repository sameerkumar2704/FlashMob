import { useEffect } from "react";
import { useToast } from "./hooks/use-toast";
import { getDetails } from "./util/fetchHandlers";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserInstance,
  changeVerificationState,
  setStateOfDialogBox,
  setToastMessage,
} from "./redux/slice";
import { PiShoppingCartLight } from "react-icons/pi";

export function GlobalContent({ children }) {
  const dispatch = useDispatch();
  const { cartList, toastMessage } = useSelector((state) => state.global);
  const { toast } = useToast();

  useEffect(() => {
    async function verifyUser() {
      try {
        let userDetail = await getDetails(
          "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8081/users/currentUser"
        );

        if (userDetail.status !== "failed") {
          dispatch(currentUserInstance(JSON.parse(userDetail.detail)));
        } else {
          userDetail = await getDetails(
            "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8081/users/refreshToken",
            {}
          );
          if (userDetail.status === "failed") {
            throw new Error(userDetail.message);
          } else {
            dispatch(currentUserInstance(JSON.parse(userDetail.detail)));
          }
        }
        dispatch(setStateOfDialogBox(false));
        return userDetail;
      } catch (err) {
        console.error(err); // Handle the error
      } finally {
        dispatch(changeVerificationState(false));
      }
    }
    verifyUser();
  }, [dispatch]);

  useEffect(() => {
    if (toastMessage) {
      toast({
        duration: 1000,
        variant: "success",
        description: toastMessage,
      });
      dispatch(setToastMessage(undefined));
    }
  }, [dispatch, toast, toastMessage]);

  return (
    <>
      {children}
      {cartList.length > 0 && (
        <div className='flex gap-2 m-4 items-center bg-white shadow-md px-3 py-1 rounded-md w-fit fixed bottom-0 border border-black/40'>
          <PiShoppingCartLight className='w-5 h-5' />
          <h1>{cartList.length}</h1>
        </div>
      )}
    </>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { getAllProducts } from "@/redux/slice";
import { NavBar } from "@/UiElements/NavBar";
import { NotificationBox } from "@/UiElements/NotificationDialog";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export function LandingPage() {
  const { verfiying } = useSelector((state) => state.global);
  if (verfiying) {
    return <h1>Loading....</h1>;
  }
  return (
    <>
      <div className=' h-screen grid grid-rows-[8vh_92vh]'>
        <NavBar />
        <Outlet />
      </div>

      {!verfiying && (
        <>
          <NotificationBox title='Registration'>
            <NotificationBox.Registration />
            <NotificationBox.Login />
          </NotificationBox>
          <Toaster />
        </>
      )}
    </>
  );
}

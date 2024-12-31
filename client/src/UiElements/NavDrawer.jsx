import { Button } from "@/components/ui/button";
import {
  currentUserInstance,
  navigationDrawerStateUpdate,
  setDialogPage,
  setStateOfDialogBox,
} from "@/redux/slice";

import { useEffect, useState } from "react";
import { GoHeart, GoSignOut } from "react-icons/go";
import { PiShoppingCartLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function NavDrawer() {
  const navigate = useNavigate();
  const { currentUser, navigationDrawerState } = useSelector(
    (state) => state.global
  );
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    if (windowWidth > 632) dispatch(navigationDrawerStateUpdate("close"));
  }, [windowWidth]);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    const outterClick = () => {
      dispatch(navigationDrawerStateUpdate("close"));
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", outterClick);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", outterClick);
    };
  }, []);
  return (
    <div
      className={` border border-black/50 shadow-lg rounded-md overflow-hidden absolute z-20  top-full  ${
        navigationDrawerState === "open" ? "visible" : "invisible"
      }`}
      onClick={() => {}}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=' flex flex-col gap-2 w-fit bg-white px-6 h-full py-4'
      >
        {currentUser && (
          <Link
            to='/profile'
            onClick={() => dispatch(navigationDrawerStateUpdate("close"))}
          >
            <div className=' flex items-center gap-2 justify-start '>
              <div className=' p-1 border border-red-100  rounded-full  h-8 w-8'>
                <div className=' font-semibold  flex justify-center items-center rounded-full w-full h-full bg-red-100'>
                  {currentUser[0]}
                </div>
              </div>
              <h1>{currentUser?.username}</h1>
            </div>
          </Link>
        )}

        <ul className=' flex justify-start flex-col gap-4'>
          {currentUser && (
            <Link
              onClick={() => dispatch(navigationDrawerStateUpdate("close"))}
              to={"/cart"}
            >
              <NavItems icons={<PiShoppingCartLight />} title='Cart' />
            </Link>
          )}

          {currentUser && (
            <button
              onClick={async () => {
                await fetch(
                  "https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:5173/users/logout"
                );
                dispatch(currentUserInstance(undefined));
                dispatch(setDialogPage("registration"));
                dispatch(setStateOfDialogBox(true));
                dispatch(navigationDrawerStateUpdate("close"));
                navigate("/");
              }}
            >
              <NavItems icons={<GoSignOut />} title='SignOut' />
            </button>
          )}
          {!currentUser && (
            <Button
              onClick={() => {
                dispatch(setStateOfDialogBox(true));
                dispatch(navigationDrawerStateUpdate("close"));
              }}
            >
              Sing Up
            </Button>
          )}
        </ul>
      </div>
    </div>
  );
}
function NavItems({ icons, title }) {
  return (
    <div className=' flex gap-2 items-center'>
      {icons}
      <h1>{title}</h1>
    </div>
  );
}

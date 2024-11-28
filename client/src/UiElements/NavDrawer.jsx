import { navigationDrawerStateUpdate } from "@/redux/slice";

import { useEffect, useState } from "react";
import { GoHeart, GoSignOut } from "react-icons/go";
import { PiShoppingCartLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

export function NavDrawer() {
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
        <div className=' flex items-center gap-2 justify-start '>
          <div className=' p-1 border border-red-100  rounded-full  h-8 w-8'>
            <div className=' font-semibold  flex justify-center items-center rounded-full w-full h-full bg-red-100'></div>
          </div>
          <h1>{currentUser?.username}</h1>
        </div>

        <ul className=' flex justify-start flex-col gap-4'>
          <NavItems icons={<GoHeart />} title='Faviourate' />
          <NavItems icons={<PiShoppingCartLight />} title='Cart' />
          <NavItems icons={<GoSignOut />} title='SignOut' />
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

import { GoHeart } from "react-icons/go";
import MenuItem from "./MenuItem";
import { PiShoppingCartLight } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavDrawer } from "./NavDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserInstance,
  navigationDrawerStateUpdate,
  setStateOfDialogBox,
} from "@/redux/slice";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

export function NavBar() {
  const { currentUser, navigationDrawerState } = useSelector(
    (state) => state.global
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchText = useRef("");
  return (
    <header>
      <nav className=' relative flex justify-between px-6 items-center py-2 gap-10 max-sm:gap-3'>
        <RxHamburgerMenu
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              navigationDrawerStateUpdate(
                navigationDrawerState === "open" ? "close" : "open"
              )
            );
          }}
          className=' max-sm:block hidden'
        />
        <Link to={"/"} className=' max-sm:hidden'>
          Logo
        </Link>
        <div className='flex-1'>
          <Input
            ref={searchText}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                const query = searchText.current.value.trim(); // Trim whitespace
                if (query) {
                  navigate(`/search/${query}`);
                } else {
                  navigate(`/`); // Navigate to the main page if the input is empty
                }
              }
            }}
            className='focus-visible:border-gray-400'
            type='text'
            placeholder='What are you looking for? 🔎'
          />
        </div>

        <ul className=' max-sm:hidden items-center flex gap-4 px-3'>
          <li>
            <MenuItem icon={<GoHeart className=' w-full h-full' />} />
          </li>
          <Link to={"/cart"}>
            <MenuItem
              icon={<PiShoppingCartLight className='w-full h-full' />}
            />
          </Link>
          {currentUser !== undefined && (
            <li className='  flex gap-2'>
              <div className=' p-1 border border-red-100  rounded-full  h-8 w-8'>
                <div className=' font-semibold  flex justify-center items-center rounded-full w-full h-full bg-red-100' />
              </div>
              <Button
                variant='primary'
                onClick={async () => {
                  await fetch("/api/users/logout");
                  dispatch(currentUserInstance(undefined));
                  dispatch(setStateOfDialogBox(true));
                }}
              >
                Log out
              </Button>
            </li>
          )}
          {currentUser === undefined && (
            <li>
              <Button
                variant='primary'
                onClick={() => dispatch(setStateOfDialogBox(true))}
              >
                Sing up
              </Button>
            </li>
          )}
        </ul>
        <NavDrawer />
      </nav>
    </header>
  );
}

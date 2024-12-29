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
  setDialogPage,
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
          <li
            onClick={() => {
              if (currentUser === undefined) {
                dispatch(setDialogPage("registration"));
                dispatch(setStateOfDialogBox(true));
              }
            }}
          >
            <MenuItem icon={<GoHeart className=' w-full h-full' />} />
          </li>
          <Link
            onClick={() => {
              if (currentUser === undefined) {
                dispatch(setDialogPage("registration"));
                dispatch(setStateOfDialogBox(true));
              }
            }}
            to={"/cart"}
          >
            <MenuItem
              icon={<PiShoppingCartLight className='w-full h-full' />}
            />
          </Link>
          {currentUser !== undefined && (
            <li className=' items-center  flex gap-2'>
              <Link
                to={"/profile"}
                className=' font-semibold text-2xl w-9 h-9 flex justify-center rounded-full items-center  bg-red-100'
              >
                <h1 className=' h-full inline-block text-center'>
                  {currentUser.username[0]}
                </h1>
              </Link>
              <Button
                variant='primary'
                onClick={async () => {
                  await fetch("/api/users/logout");
                  dispatch(currentUserInstance(undefined));
                  dispatch(setDialogPage("registration"));
                  dispatch(setStateOfDialogBox(true));
                  navigate("/");
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

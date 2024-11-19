import { GoHeart } from "react-icons/go";
import MenuItem from "./MenuItem";
import { PiShoppingCartLight } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/usercontex";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/globaleContext";

export function NavBar() {
  const { currentUser, setCurrentUser } = useUserContext();
  const { setShow } = useGlobalContext();
  return (
    <header>
      <nav className=' flex justify-between px-6 items-center py-2 gap-10'>
        <h1>Logo</h1>
        <div className=' flex-1'>
          <Input placeholder='what are you looking for ? 🔎' />
        </div>

        <ul className=' items-center flex gap-4 px-3'>
          <li>
            <MenuItem icon={<GoHeart className=' w-full h-full' />} />
          </li>
          <li>
            <MenuItem
              icon={<PiShoppingCartLight className='w-full h-full' />}
            />
          </li>
          {currentUser && (
            <li className=' flex gap-2'>
              <div className=' p-1 border border-red-100  rounded-full  h-8 w-8'>
                <div className=' font-semibold  flex justify-center items-center rounded-full w-full h-full bg-red-100'>
                  {currentUser.username.charAt(0)}
                </div>
              </div>
              <Button
                variant='primary'
                onClick={async () => {
                  const res = await fetch("/api/users/logout");
                  setCurrentUser(undefined);
                }}
              >
                Log out
              </Button>
            </li>
          )}
          {!currentUser && (
            <li>
              <Button variant='primary' onClick={() => setShow(true)}>
                Sing up
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

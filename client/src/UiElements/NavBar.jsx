import { GoHeart } from "react-icons/go";
import MenuItem from "./MenuItem";
import { PiShoppingCartLight } from "react-icons/pi";
import { Input } from "@/components/ui/input";

export function NavBar() {
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
          <li>
            <div className=' p-1 border border-red-500  rounded-full  h-8 w-8'>
              <div className=' rounded-full w-full h-full bg-red-500'></div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

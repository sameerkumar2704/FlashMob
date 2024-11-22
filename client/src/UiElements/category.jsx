import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { PiShirtFoldedLight } from "react-icons/pi";
export function Category() {
  const [category, setCategory] = useState("all");
  return (
    <div className=' drop-shadow items-center  w-fit mx-auto border border-black/40 flex gap-3  py-1 px-2   rounded-md'>
      <button
        onClick={() => setCategory("all")}
        className={` rounded-md p-1 ${
          category === "all" && "bg-red-500 text-white"
        }  text-xs py-1 px-2 `}
      >
        All
      </button>
      <button>
        <HiOutlineLightBulb
          onClick={() => setCategory("electronic")}
          className={`   rounded-md  w-6 h-6 p-1 ${
            category === "electronic" && "bg-red-500 stroke-white"
          }  `}
        />
      </button>
      <button>
        <PiShirtFoldedLight
          className={`  rounded-md  w-6 h-6 p-1    ${
            category === "cloths" && "bg-red-500 fill-white"
          }`}
          onClick={() => setCategory("cloths")}
        />
      </button>
    </div>
  );
}

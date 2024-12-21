import { memo, useEffect, useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { PiShirtFoldedLight } from "react-icons/pi";
function CategoryOption({ category, children, setCategory, type }) {
  return (
    <button
      onClick={() => setCategory(type)}
      className={` rounded-md p-1 ${
        type === category && "bg-red-500 text-white"
      }  text-xs py-1 px-2 `}
    >
      {children}
    </button>
  );
}
export const Category = memo(function Category({ dataHandler }) {
  const [category, setCategory] = useState("all");
  useEffect(() => {
    dataHandler(category);
  }, [category, dataHandler]);

  return (
    <div className=' drop-shadow items-center  w-fit mx-auto border border-black/40 flex gap-3  py-1 px-2   rounded-md'>
      <CategoryOption
        type={"all"}
        category={category}
        setCategory={setCategory}
      >
        <h1>All</h1>
      </CategoryOption>
      <CategoryOption
        type={"electronics"}
        category={category}
        setCategory={setCategory}
      >
        <h1>Electronics</h1>
      </CategoryOption>
    </div>
  );
});

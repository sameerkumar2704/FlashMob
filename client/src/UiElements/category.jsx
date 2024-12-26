import { memo, useEffect, useRef, useState } from "react";
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
export const Category = memo(function Category({
  dataHandler,
  category,
  setCategory,
  categoriesList,
}) {
  useEffect(() => {
    dataHandler(category);
  }, [category, dataHandler]);

  return (
    <div className=' max-sm:mx-3 drop-shadow items-center  w-fit flex-wrap mx-auto border border-black/40 flex gap-3  py-1 px-2   rounded-md'>
      {categoriesList.current.map((curr) => (
        <>
          <CategoryOption
            type={curr}
            category={category}
            setCategory={setCategory}
          >
            <h1> {curr[0].toUpperCase() + curr.substring(1)}</h1>
          </CategoryOption>
        </>
      ))}
    </div>
  );
});

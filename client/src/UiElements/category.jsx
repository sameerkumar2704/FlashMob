import { memo, useEffect, useRef, useState } from "react";

function CategoryOption({
  category,
  children,
  setCategory,
  type,
  dataHandler
}) {
  return (
    <button
      onClick={() => {
        setCategory(type);
        dataHandler(type);
      }}
      className={`rounded-md p-1 ${type === category &&
        "bg-red-500 text-white"} text-xs py-1 px-2`}
    >
      {children}
    </button>
  );
}

export const Category = memo(function Category({
  dataHandler,
  category,
  setCategory,
  categoriesList
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown on small screens
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="mt-5 max-sm:mx-3 drop-shadow items-center w-fit mx-auto border border-black/40 rounded-md">
      {/* Dropdown for small screens */}
      <div className="sm:hidden flex flex-col items-start">
        <button
          onClick={toggleDropdown}
          className="rounded-md py-2 px-4 bg-red-500 text-white font-bold text-sm w-full "
        >
          Category {dropdownOpen ? "▲" : "▼"}
        </button>
        {/* Dropdown options for small screens */}
        {dropdownOpen && (
          <div className="flex flex-col gap-2 mt-2 w-full items-center">
            {categoriesList.current.map((curr) => (
              <CategoryOption
                key={curr}
                type={curr}
                category={category}
                setCategory={setCategory}
                dataHandler={dataHandler}
              >
                <h1>{curr[0].toUpperCase() + curr.substring(1)}</h1>
              </CategoryOption>
            ))}
          </div>
        )}
      </div>

      {/* Regular category options for larger screens */}
      <div className="hidden sm:flex gap-3 py-1 px-2">
        {categoriesList.current.map(curr =>
          <CategoryOption
            key={curr}
            type={curr}
            category={category}
            setCategory={setCategory}
            dataHandler={dataHandler}
          >
            <h1>
              {curr[0].toUpperCase() + curr.substring(1)}
            </h1>
          </CategoryOption>
        )}
      </div>
    </div>
  );
});

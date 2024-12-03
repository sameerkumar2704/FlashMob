import React, { useState, useEffect } from "react";
import { ProductView } from "../UiElements/ProductView";
import { ProductFilter } from "../components/ProductFilter";
import { Pagination } from "../components/Pagination";

import { staticProducts } from "./staticProducts";

export function FilterProductPage() {
  const maxPrice = Math.max(...staticProducts.map((p) => p.price));
  const [filters, setFilters] = useState({
    category: "",
    priceRange: maxPrice,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const rowHeight = 250;
      const rows = Math.floor(height / rowHeight);

      if (width >= 1024) setProductsPerPage(rows * 4);
      else if (width >= 768) setProductsPerPage(rows * 3);
      else setProductsPerPage(rows * 2);

      setCurrentPage(1);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts = staticProducts.filter((product) => {
    const withinPriceRange = product.price <= filters.priceRange;
    const matchesCategory = filters.category
      ? product.category === filters.category
      : true;
    return withinPriceRange && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleFilterChange = ({ type, value }) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
    setLoading(true);

    setTimeout(() => setLoading(false), 2000);
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className='flex overflow-hidden'>
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full z-20 bg-white  px-4 py-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0`}
      >
        <ProductFilter
          onFilterChange={handleFilterChange}
          maxPrice={maxPrice}
        />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col px-4 py-2 relative'>
        {/* Heading */}

        <button
          className='block md:hidden bg-red-500 outline-none  text-white px-4 py-2 rounded shadow-md mb-4'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          Filter
        </button>

        {/* Loader */}
        {loading ? (
          <div className='flex justify-center items-center flex-1'>
            <div className='loader border-t-4 border-red-500 rounded-full w-16 h-16 animate-spin'></div>
          </div>
        ) : (
          <>
            <div className=' p-2 h-full flex flex-col justify-between gap-5 overflow-y-auto  w-full box-border '>
              {/* Product Grid */}
              <div className=' max-[450px]:grid-cols-1   max-[1000px]:grid-cols-2 max-xl:grid-cols-3 h-fit   grid grid-cols-4 gap-4 '>
                {displayedProducts.map((product) => (
                  <ProductView
                    key={product.id}
                    productDetails={{
                      img: product.images[0].url,
                      title: product.name,
                      price: product.price,
                      isSoldOut: product.isSoldOut,
                      starCount: 3,
                    }}
                  />
                ))}
              </div>

              {/* Pagination at the bottom */}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalProducts={filteredProducts.length}
                productsPerPage={productsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

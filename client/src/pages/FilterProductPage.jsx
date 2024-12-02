import React, { useState, useEffect } from "react";
import { ProductView } from "../UiElements/ProductView";
import { ProductFilter } from "../components/ProductFilter";
import { Pagination } from "../components/Pagination";

import { staticProducts } from "./staticProducts"; 

export function FilterProductPage() {
  const maxPrice = Math.max(...staticProducts.map((p) => p.price));
  const [filters, setFilters] = useState({ category: "", priceRange: maxPrice });
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
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full z-20 bg-white border-r shadow-lg px-4 py-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0`}
      >
        <ProductFilter onFilterChange={handleFilterChange} maxPrice={maxPrice} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4 py-2 relative">
        {/* Heading */}
        <div className="relative pt-3 pb-4 border-b shadow-md mb-4 flex justify-center items-center">
          <h1 className="absolute text-5xl md:text-7xl font-bold text-gray-400 opacity-10 leading-relaxed ">
            PRODUCTS
          </h1>
          <div className="relative text-center">
            <h1 className="text-xl md:text-3xl font-semibold text-gray-700">
              Explore Our Products
            </h1>
            <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto mt-2" />
          </div>
        </div>
        
        <button
          className="block md:hidden bg-red-500 text-white px-4 py-2 rounded shadow-md mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          Filter
        </button>
        
        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <div className="loader border-t-4 border-red-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            <div className="mt-auto">
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
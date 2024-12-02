import React, { useState, useEffect } from "react";
import { ProductView } from "../UiElements/ProductView";
import { ProductFilter } from "../components/ProductFilter";
import { Pagination } from "../components/Pagination";

const staticProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 50,
    category: "Electronics",
    images: [{ url: "path/to/image1.jpg" }],
    isSoldOut: false
  },
  {
    id: 2,
    name: "Product 2",
    price: 75,
    category: "Clothing",
    images: [{ url: "path/to/image2.jpg" }],
    isSoldOut: false
  },
  {
    id: 3,
    name: "Product 3",
    price: 150,
    category: "Electronics",
    images: [{ url: "path/to/image3.jpg" }],
    isSoldOut: false
  },
  {
    id: 4,
    name: "Product 4",
    price: 225,
    category: "Clothing",
    images: [{ url: "path/to/image4.jpg" }],
    isSoldOut: true
  },
  {
    id: 5,
    name: "Product 5",
    price: 300,
    category: "Books",
    images: [{ url: "path/to/image5.jpg" }],
    isSoldOut: false
  },
  {
    id: 6,
    name: "Product 6",
    price: 350,
    category: "Electronics",
    images: [{ url: "path/to/image6.jpg" }],
    isSoldOut: false
  },
  {
    id: 7,
    name: "Product 7",
    price: 400,
    category: "Clothing",
    images: [{ url: "path/to/image7.jpg" }],
    isSoldOut: false
  },
  {
    id: 8,
    name: "Product 8",
    price: 450,
    category: "Books",
    images: [{ url: "path/to/image8.jpg" }],
    isSoldOut: true
  }
];

export function FilterProductPage() {
  const maxPrice = Math.max(...staticProducts.map(p => p.price));
  const [filters, setFilters] = useState({
    category: "",
    priceRange: maxPrice
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setProductsPerPage(6);
      } else if (width >= 768) {
        setProductsPerPage(4);
      } else {
        setProductsPerPage(2);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts = staticProducts.filter(product => {
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
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Filter Products</h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 w-full mb-4 md:mb-0">
          <ProductFilter
            onFilterChange={handleFilterChange}
            maxPrice={maxPrice}
          />
        </div>
        <div className="md:w-3/4 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map(product =>
              <ProductView
                key={product.id}
                productDetails={{
                  img: product.images[0].url,
                  title: product.name,
                  price: product.price,
                  isSoldOut: product.isSoldOut,
                  starCount: 3
                }}
              />
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

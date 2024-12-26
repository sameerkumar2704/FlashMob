import { useState, useEffect } from "react";
import { ProductFilter } from "../components/ProductFilter";
import { Pagination } from "../components/Pagination";
import { useLoaderData } from "react-router-dom";
import { ProductView } from "../UiElements/ProductView";

export function FilterProductPage() {
  let productList = useLoaderData();
  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: Infinity,
  });
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ["tv", "gaming", "audio", "mobile"];
  useEffect(() => {
    setList(productList.list);
  }, [productList]);
  // Fetch products data
  useEffect(() => {
    setLoading(true);
    Promise.all(
      categories.map((category) =>
        fetch(`https://fakestoreapi.in/api/products/category?type=${category}`)
          .then((res) => res.json())
          .then((data) => (data.status === "SUCCESS" ? data.products : []))
      )
    )
      .then((results) => {
        const combinedProducts = results.flat().slice(0, 60);
        setProducts(combinedProducts);
        const maxFetchedPrice = Math.max(
          ...combinedProducts.map((p) => p.price)
        );
        setMaxPrice(maxFetchedPrice); // Set maxPrice dynamically
        setFilters((prev) => ({ ...prev, priceRange: maxFetchedPrice })); // Update initial price range
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Adjust productsPerPage on window resize
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

  // Filter the products based on selected category and price range
  const filteredProducts = products.filter((product) => {
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
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
        className={`fixed top-0 left-0 h-full z-20 bg-white px-4 py-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0`}
      >
        <ProductFilter
          onFilterChange={handleFilterChange}
          maxPrice={maxPrice}
          categories={categories}
          currentPriceRange={filters.priceRange}
        />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col px-4 py-2 relative'>
        <button
          className='block md:hidden bg-red-500 text-white px-4 py-2 rounded shadow-md mb-4'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          Filter
        </button>

        {loading ? (
          <div className='flex justify-center items-center flex-1'>
            <div className='w-16 h-16 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
          </div>
        ) : (
          <>
            <div className='p-2 h-full flex flex-col justify-between gap-5 overflow-y-auto w-full box-border'>
              <div className='max-[450px]:grid-cols-1 max-[1000px]:grid-cols-2 max-xl:grid-cols-3 h-fit grid grid-cols-4 gap-4'>
                {list.map((product) => (
                  <ProductView
                    Key={product}
                    productDetails={{
                      id: product._id,
                      img: product.image,
                      title: product.title,
                      starCount: 1,
                      price: product.price,
                      latest: product.latest,
                    }}
                  />
                ))}
              </div>
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

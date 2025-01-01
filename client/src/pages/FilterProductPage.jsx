import { useState, useEffect, useRef } from "react";
import { ProductFilter } from "../components/ProductFilter";
import { Pagination } from "../components/Pagination";
import { useLocation, useParams } from "react-router-dom";
import { ProductView } from "../UiElements/ProductView";
import { getDetails } from "@/util/fetchHandlers";

export function FilterProductPage() {
  const listType = useParams();

  const [list, setList] = useState({});

  const [filters, setFilters] = useState({
    category: "",
    priceRange: Infinity,
  });
  const currentLocation = useLocation();
  const maxPrice = useRef(Infinity);
  const [maxPage, setMaxPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [start, setStartPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageArray, setPageArray] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products data
  useEffect(() => {
    async function getDataPageChange() {
      const data = await getDetails(
        `https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8081/product/all?search=${listType.searchText}&&page=${currentPage}&&limit=16&&maxPrice=${filters.priceRange}`
      );

      setList(data);
      setMaxPages(data.maxPages);
      setLoading(false);
    }
    getDataPageChange();
  }, [currentPage, filters, listType, maxPrice]);

  // Adjust productsPerPage on window resize

  const handleFilterChange = ({ type, value }) => {
    console.log(value);
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((curr) => {
      if (curr === 1 && direction === -1) return curr;
      if (curr === maxPage && direction === 1) return curr;
      let nextPage = curr + direction;
      const arr = [];
      if (nextPage === start + 5) {
        const nextStart = start + 5;
        for (let i = nextStart; i <= Math.min(maxPage, nextStart + 5); i++) {
          arr.push(i);
        }

        setStartPage(nextPage);
      } else if (nextPage < start) {
        for (let i = start - 4; i <= start; i++) {
          arr.push(i);
        }
        setStartPage(start - 4);
      }

      if (arr.length !== 0) setPageArray(arr);
      return nextPage;
    });
  };
  useEffect(() => {
    let arr = [];
    for (let i = 1; i <= Math.min(maxPage, 5); i++) arr.push(i);
    setPageArray(arr);
  }, [maxPage]);

  if (loading)
    return (
      <div className='flex justify-center items-center flex-1'>
        <div className='w-16 h-16 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
      </div>
    );

  if (list.list.length === 0)
    return (
      <div className=' flex gap-6 flex-col pt-32 items-center'>
        <h1 className=' text-6xl'>🔎</h1>
        <h1 className=' text-lg bg-red-500 text-white rounded-md px-5 py-2'>
          Sorry, No Result not found
        </h1>
      </div>
    );

  return (
    <div className='flex overflow-hidden'>
      {currentLocation.pathname.match("/search/") && (
        <>
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
              minPrice={list.minPrice}
              maxPrice={list.maxPrice}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className='flex-1 flex flex-col px-4 py-2 relative'>
        {currentLocation.pathname.match("/search/") && (
          <button
            className='block md:hidden bg-red-500 text-white px-4 py-2 rounded shadow-md mb-4'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            Filter
          </button>
        )}

        {loading ? (
          <div className='flex justify-center items-center flex-1'>
            <div className='w-16 h-16 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
          </div>
        ) : (
          <>
            <div className='p-2 h-full flex flex-col justify-between gap-5 overflow-y-auto w-full box-border'>
              <div className='max-[450px]:grid-cols-1 max-[1000px]:grid-cols-2 max-xl:grid-cols-3 h-fit grid grid-cols-4 gap-4'>
                {list.list.map((product) => (
                  <ProductView
                    Key={product._id}
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
                handlePageChange={handlePageChange}
                pageArray={pageArray}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

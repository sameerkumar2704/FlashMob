import { useState, useEffect, useRef } from "react";
import { ProductFilter } from "../components/ProductFilter";
import { Pagination } from "../components/Pagination";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { ProductView } from "../UiElements/ProductView";
import { getDetails } from "@/util/fetchHandlers";

export function ViewAllPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const listType = useParams();
  const [list, setList] = useState([]);

  const maxPage = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [start, setStartPage] = useState(1);

  const [pageArray, setPageArray] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products data
  useEffect(() => {
    async function getDataPageChange() {
      setLoading(true);
      const data = await getDetails(
        `https://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8081/product/${
          listType.type
        }?limit=16&&page=${currentPage}&&category=${searchParams.get(
          "category"
        )}`
      );
      setLoading(false);
      setList(data.list);
      maxPage.current = data.maxPages;
      let arr = [];
      for (let i = 1; i <= Math.min(data.maxPages, 5); i++) arr.push(i);
      setPageArray(arr);
    }
    getDataPageChange();
  }, [currentPage, listType.type, searchParams]);

  // Adjust productsPerPage on window resize

  const handlePageChange = (direction) => {
    setCurrentPage((curr) => {
      if (curr === 1 && direction === -1) return curr;
      if (curr === maxPage.current && direction === 1) return curr;
      let nextPage = curr + direction;
      const arr = [];
      if (nextPage === start + 5) {
        const nextStart = start + 5;
        for (
          let i = nextStart;
          i <= Math.min(maxPage.current, nextStart + 5);
          i++
        ) {
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

  if (loading)
    return (
      <div className='flex justify-center items-center flex-1'>
        <div className='w-16 h-16 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
      </div>
    );
  return (
    <div className=' flex flex-col justify-center'>
      <div className=' flex h-8 items-center gap-2 mx-4 my-5'>
        <div className=' bg-red-500  w-4 rounded-sm h-full '></div>
        <h1 className=' font-semibold text-red-500 text-lg'>
          {" "}
          {searchParams.get("title")}
        </h1>
      </div>
      <div className='flex overflow-hidden'>
        {/* Main Content */}

        <div className='flex-1 flex flex-col px-4 py-2 relative'>
          <>
            <div className='p-2 h-full flex flex-col justify-between gap-5 overflow-y-auto w-full box-border'>
              <div className='max-[450px]:grid-cols-1 max-[1000px]:grid-cols-2 max-xl:grid-cols-3 h-fit grid grid-cols-4 gap-4'>
                {list.map((product) => (
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
              {maxPage.current > 1 && (
                <Pagination
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  pageArray={pageArray}
                />
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

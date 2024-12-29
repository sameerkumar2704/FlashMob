import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Pagination({ handlePageChange, pageArray, currentPage }) {
  return (
    <div className=' flex-wrap flex gap-4 justify-center items-center'>
      <Button
        className='max-sm:py-1 max-sm:px-2  max-sm:text-sm'
        onClick={() => handlePageChange(-1)}
      >
        Prev
      </Button>
      <div className=' flex gap-5 '>
        {pageArray.map((page) => (
          <>
            <div
              className={` max-sm:w-8 max-sm:h-8 flex justify-center items-center w-10 h-10 rounded-md ${
                currentPage === page ? "bg-red-500 text-white" : " border "
              } `}
            >
              {page}
            </div>
          </>
        ))}
      </div>
      <Button
        className='max-sm:py-1 max-sm:px-2  max-sm:text-sm'
        onClick={() => handlePageChange(1)}
      >
        Next
      </Button>
    </div>
  );
}

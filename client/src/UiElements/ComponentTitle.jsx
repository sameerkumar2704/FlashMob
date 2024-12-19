import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ComponentTitle({ title, lessElements }) {
  return (
    <div className=' flex h-8 items-center gap-2'>
      <div className=' bg-red-500  w-4 rounded-sm h-full '></div>
      <h1 className=' font-semibold text-red-500 text-sm'>{title}</h1>
      {!lessElements && (
        <Link className=' ml-auto' to='/filter-products'>
          <Button variant='primary'>view all</Button>
        </Link>
      )}
    </div>
  );
}

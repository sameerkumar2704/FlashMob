import { Button } from "@/components/ui/button";

export function ComponentTitle({ title }) {
  return (
    <div className=' flex h-8 items-center gap-2'>
      <div className=' bg-red-500  w-4 rounded-sm h-full '></div>
      <h1 className=' font-semibold text-red-500 text-sm'>{title}</h1>
      <Button variant='primary' className='ml-auto'>
        view all
      </Button>
    </div>
  );
}

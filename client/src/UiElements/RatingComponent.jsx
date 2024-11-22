import { GoStarFill } from "react-icons/go";

export function RatingComponents({ ratingCount = 0 }) {
  return (
    <div className=' flex gap-1'>
      {Array.from({ length: 5 }).map((_, index) => (
        <GoStarFill
          key={"start_" + index}
          className={
            " w-4 h-4 " +
            `${ratingCount > index ? "fill-yellow-300" : "fill-gray-300"}`
          }
        />
      ))}
      <div></div>
    </div>
  );
}

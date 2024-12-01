import { RatingComponents } from "@/UiElements/RatingComponent";
import { useState } from "react";
function ProductOverviewImage() {
  const [selected_image, seImage] = useState("blue");
  return (
    <div className='  grid gap-4 grid-cols-[10vw_auto] '>
      <div className='  h-96 bg-green-600 grid grid-rows-2 gap-4 p-2 items-center'>
        <div
          className=' bg-blue-600 h-full '
          onClick={() => seImage("blue")}
        ></div>
        <div
          onClick={() => seImage("red")}
          className=' bg-red-600 h-full'
        ></div>
      </div>
      <div className={` h-96 bg-${selected_image}-600`}></div>
    </div>
  );
}
function ColorSelector({ selectedColor, setSelectedColor, color }) {
  console.log(selectedColor);
  return (
    <div
      onClick={() => setSelectedColor(color)}
      className={` bg-[${color}-700] w-6 h-6 rounded-full border-2 ${
        color === selectedColor && "border-black"
      }`}
    ></div>
  );
}
function SizeSelector({ selectedSize, setSelectedSize, color }) {
  return (
    <div>
      onClick={() => setSelectedSize(color)}
      className=
      {` bg-[${color}-700] w-6 h-6 rounded-full border-2 ${
        color === selectedSize && "border-black"
      }`}
    </div>
  );
}
function ProductDetails() {
  const [selectedColor, setSelectedColor] = useState();
  return (
    <div className=' grid grid-cols-[60vw_auto] '>
      <ProductOverviewImage />
      <div className=' p-2 font-semibold '>
        <h1>Product Title</h1>
        <RatingComponents ratingCount={4} />
        <h1 className=' font-light '>
          <span className=' font-normal'>$</span>90.3
        </h1>
        <p className=' text-start font-light text-sm'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus
          voluptates quisquam, quos exercitationem placeat aliquam obcaecati
          iste, atque at sapiente iusto maiores, voluptas quod tenetur fuga
          magnam blanditiis est explicabo!
        </p>
        <div className=' flex gap-2 items-center'>
          <p1>Colors :</p1>
          <div className=' flex gap-4'>
            {Array.from(["red", "blue"]).map((color) => (
              <ColorSelector
                key={color}
                color={color}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetails;

import { ComponentTitle } from "./ComponentTitle";
import { ProductView } from "./ProductView";

export function HorizontalView({ productList }) {
  return (
    <div className=' p-4 space-y-4'>
      <ComponentTitle title={"Product"} />
      <div className=' max-lg:flex overflow-x-auto grid grid-cols-5 gap-2'>
        <>
          {productList.map((product) => (
            <ProductView
              Key={product}
              productDetails={{
                id: product._id,
                img: product.images[0].url,
                title: product.name,
                starCount: 1,
                price: 200,
                faviourate: true,
              }}
            />
          ))}
        </>
      </div>
    </div>
  );
}

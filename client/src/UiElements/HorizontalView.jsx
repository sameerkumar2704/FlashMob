import { ComponentTitle } from "./ComponentTitle";
import { ProductView } from "./ProductView";

export function HorizontalView({ productList, title }) {
  console.log(productList);
  return (
    <div className=' p-4 space-y-4'>
      <ComponentTitle title={title} lessElements={productList.length < 5} />
      <div className=' flex overflow-x-auto gap-2'>
        <>
          {productList.map((product) => (
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
        </>
      </div>
    </div>
  );
}

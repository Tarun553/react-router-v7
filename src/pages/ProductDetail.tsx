import { getProductById } from "../features/products/api";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import type { Product } from "../features/products/types";


export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  const rawId = params.id;
  const id = Number(rawId);

  if (!rawId || Number.isNaN(id)) {
    throw new Response("Invalid product id", { status: 400 });
  }

  const product = await getProductById(id);
  return { product };
}

const ProductDetail = () => {
  const { product } = useLoaderData() as { product: Product };
  return (
    <div>
        <h1>ProductDetail</h1>
        <p>{product.title}</p>
        <p>{product.description}</p>
        <p>{product.price}</p>
    </div>
  )
}

export default ProductDetail
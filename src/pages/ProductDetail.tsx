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
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
          {/* Product Image Placeholder */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
              <span className="text-gray-300 text-lg font-medium">Product Image</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full mb-4">
                Premium Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                {product.title}
              </h1>
              <p className="text-3xl font-light text-gray-900">
                ${product.price}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Details</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-10">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 transform active:scale-95 shadow-lg shadow-gray-200">
                Add to Cart
              </button>
              <button className="px-8 py-4 rounded-2xl border-2 border-gray-100 font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300">
                Save for later
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
import type { ProductListResponse, Product } from "./types";

const BASE_URL = "https://dummyjson.com";

type ListArgs = {
  q?: string;
  limit?: number;
  skip?: number;
};

export async function listProducts({ q, limit = 12, skip = 0 }: ListArgs): Promise<ProductListResponse> {
  const url = new URL(q ? `${BASE_URL}/products/search` : `${BASE_URL}/products`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("skip", String(skip));
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  return (await res.json()) as ProductListResponse;
}



export async function getProductById(id: number): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
    return (await res.json()) as Product;
}

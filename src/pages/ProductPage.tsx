import { Form, Link, useLoaderData, useSearchParams, useFetcher } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { listProducts } from "../features/products/api";
import type { Product } from "../features/products/types";
import { getFavoriteSet } from "../features/products/fav";

const PAGE_SIZE = 12;

export async function productsLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);

  const skip = (page - 1) * PAGE_SIZE;
  const data = await listProducts({
    q: q || undefined,
    limit: PAGE_SIZE,
    skip,
  });
  const favoriteSet = getFavoriteSet();

  return {
    q,
    page,
    pageSize: PAGE_SIZE,
    total: data.total,
    products: data.products.map((p) => ({
      ...p,
      favorite: favoriteSet.has(p.id),
    })),
  };
}

export default function ProductsPage() {
  const { q, page, pageSize, total, products } = useLoaderData() as {
    q: string;
    page: number;
    pageSize: number;
    total: number;
    products: (Product & { favorite: boolean })[];
  };

  const [params] = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const prevTo = new URLSearchParams(params);
  prevTo.set("page", String(Math.max(1, page - 1)));

  const nextTo = new URLSearchParams(params);
  nextTo.set("page", String(Math.min(totalPages, page + 1)));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section>
        <h2 style={{ marginBottom: 8 }}>Products</h2>

        <Form
          method="get"
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input name="q" defaultValue={q} placeholder="Search products..." />
          <button type="submit">Search</button>

          <input type="hidden" name="page" value="1" />

          {q && <Link to="/products">Clear</Link>}
        </Form>
      </section>

      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          Page <b>{page}</b> / {totalPages} • Total <b>{total}</b>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Link
            to={`/products?${prevTo.toString()}`}
            aria-disabled={page <= 1}
            style={{
              pointerEvents: page <= 1 ? "none" : "auto",
              opacity: page <= 1 ? 0.5 : 1,
            }}
          >
            ← Prev
          </Link>

          <Link
            to={`/products?${nextTo.toString()}`}
            aria-disabled={page >= totalPages}
            style={{
              pointerEvents: page >= totalPages ? "none" : "auto",
              opacity: page >= totalPages ? 0.5 : 1,
            }}
          >
            Next →
          </Link>
        </div>
      </section>

      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          padding: 0,
          listStyle: "none",
        }}
      >
        {products.map((p) => (
          <li
            key={p.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <strong>{p.title}</strong>
              <span>₹{p.price}</span>
            <FavoriteButton id={p.id} favorite={p.favorite} />

            </div>
            <p style={{ margin: "8px 0", color: "#555" }}>
              {p.description.slice(0, 70)}…
            </p>
         
            <Link to={`/products/${p.id}`}>View</Link>
            <span style={{ fontSize: 12, color: "#777" }}>
              #{p.id} • {p.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}



function FavoriteButton({ id, favorite }: { id: number; favorite: boolean }) {
  const fetcher = useFetcher();

  // Optional optimistic UI:
  const isSubmittingThis = Number(fetcher.formData?.get("id")) === id;
  const optimisticFavorite = isSubmittingThis ? !favorite : favorite;

  return (
    <fetcher.Form method="post" action="/favorites" style={{ display: "inline" }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" aria-label="Toggle favorite">
        {optimisticFavorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}


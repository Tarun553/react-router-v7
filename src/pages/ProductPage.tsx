import { Form, Link, useLoaderData, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { listProducts } from "../features/products/api";
import type { Product } from "../features/products/types";
import { getFavoriteSet } from "../features/products/fav";
import { FavoriteButton } from "../components/FavButton";

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

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Products
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Browse items, search quickly, and favorite what you like.
            </p>
          </div>

          {/* Search */}
          <Form method="get" className="flex w-full gap-2 sm:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search products…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                {/* magnifier */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </div>
            </div>

            <input type="hidden" name="page" value="1" />

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Search
            </button>

            {q && (
              <Link
                to="/products"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Clear
              </Link>
            )}
          </Form>
        </div>

        {/* Meta + Pagination */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-700">
            Page <span className="font-semibold text-slate-900">{page}</span> /{" "}
            {totalPages} • Total{" "}
            <span className="font-semibold text-slate-900">{total}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products?${prevTo.toString()}`}
              aria-disabled={prevDisabled}
              className={[
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                prevDisabled
                  ? "pointer-events-none border-slate-200 bg-slate-50 text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100",
              ].join(" ")}
            >
              <span aria-hidden>←</span> Prev
            </Link>

            <Link
              to={`/products?${nextTo.toString()}`}
              aria-disabled={nextDisabled}
              className={[
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                nextDisabled
                  ? "pointer-events-none border-slate-200 bg-slate-50 text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100",
              ].join(" ")}
            >
              Next <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {p.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-500">#{p.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                    ₹{p.price}
                  </span>
                  <FavoriteButton id={p.id} favorite={p.favorite} />
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {p.description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  to={`/products/${p.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  View
                </Link>

                <span className="text-xs text-slate-400">
                  Updated listing
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-slate-900">No products found</p>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

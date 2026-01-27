import { useFetcher } from "react-router";

export function FavoriteButton({ id, favorite }: { id: number; favorite: boolean }) {
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


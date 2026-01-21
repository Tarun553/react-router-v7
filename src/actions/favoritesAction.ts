import type { ActionFunctionArgs } from "react-router";
import { toggleFavorite } from "../features/products/fav";

export async function favoritesAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  if (Number.isNaN(id)) {
    throw new Response("Invalid id", { status: 400 });
  }

  toggleFavorite(id);

  // We return something small (optional)
  return null
}

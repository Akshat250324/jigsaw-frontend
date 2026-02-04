const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getImagesByCategory(category) {
  const res = await fetch(`${BASE_URL}/api/images/category/${category}`);
  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }
  return res.json();
}

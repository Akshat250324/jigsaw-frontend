// src/js/images.js
// Fetch images from backend by category

const BASE_URL = "http://localhost:8080/api/images";

export const fetchImagesByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/category/${category}`);

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  const data = await res.json();

  // return only image URLs (game logic stays same)
  return data.map((img) => img.imageUrl);
};

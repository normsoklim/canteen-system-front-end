import api from '../../services/api';
import type { Product, ProductApiResponse, Category } from '../../types/Product';

/** The top-level wrapper returned by the /menu endpoint */
interface MenuApiResponse {
  success: boolean;
  data: ProductApiResponse[];
}

/**
 * Fetches the menu from the real API and normalises every product so that
 * `price` is a **number** (the API returns it as a string like "2.00").
 */
export async function fetchMenu(): Promise<Product[]> {
  const response = await api.get<MenuApiResponse>('/menu');

  const raw = response.data;

  const products: Product[] = raw.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: parseFloat(item.price),
    image: item.image,
    category_id: item.category_id,
    category: item.category,
    isAvailable: item.isAvailable,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return products;
}

/**
 * Extracts the unique categories from a list of products.
 */
export function extractCategories(products: Product[]): Category[] {
  const seen = new Map<number, Category>();
  products.forEach((p) => {
    if (!seen.has(p.category.id)) {
      seen.set(p.category.id, p.category);
    }
  });
  return Array.from(seen.values());
}

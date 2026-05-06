export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category_id: number;
  category: Category;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  tag?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Raw product shape returned by the /menu API (price is a string) */
export interface ProductApiResponse {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  category_id: number;
  category: Category;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
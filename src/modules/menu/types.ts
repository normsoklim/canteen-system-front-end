

export interface MenuCategory {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface MenuFilter {
  category?: string;
  searchQuery?: string;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
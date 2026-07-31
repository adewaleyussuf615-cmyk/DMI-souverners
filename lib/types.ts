export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  catalogs: string[];
  rating: number | null;
  moq: string | null;
  weight: string | null;
  description: string | null;
  long_description: string | null;
  features: string[];
  images: string[];
  badge: string | null;
  created_at?: string;
};

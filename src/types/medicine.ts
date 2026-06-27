export interface Medicine {
  id: number;
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  strength: string;
  description: string;
  category_id: number | null;
}
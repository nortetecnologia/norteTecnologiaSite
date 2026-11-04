export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  subcategory_id?: string;
  images: ProductImage[];
  variations?: ProductVariation[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  is_primary: boolean;
  cloudinary_public_id?: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  values: ProductVariationValue[];
}

export interface ProductVariationValue {
  id: string;
  value: string;
  price_modifier?: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_min?: number;
  price_max?: number;
  modalities: ServiceModality[];
  is_active: boolean;
}

export type ServiceModality = "remote" | "on_site" | "in_store";

export interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  selected_variations?: Record<string, string>;
  image_url?: string;
}

export interface StoreSettings {
  whatsapp_number: string;
  email?: string;
  address?: string;
  business_hours?: string;
  payment_methods: string[];
}

export type VitrineDisplayType = "carousel" | "grid" | "row";

export interface Vitrine {
  id: string;
  slug: string;
  title: string;
  display_type: VitrineDisplayType;
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface VitrineProduct {
  id: string;
  vitrine_id: string;
  product_id: string;
  position: number;
  product?: Product;
}

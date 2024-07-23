import { Product } from "~/models/Product";

export type CartItem = {
  id?: string;
  cart_id?: string;
  product_id?: string;
  price?: number;
  product: Product;
  count: number;
};

import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  id?: string;
  cart_id?: string;
  product_id?: string;
  price?: number;
  count: number;
};

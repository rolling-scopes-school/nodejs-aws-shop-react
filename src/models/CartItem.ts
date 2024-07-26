import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  cart: {
    items: CartItem[];
    total: number;
  };
};

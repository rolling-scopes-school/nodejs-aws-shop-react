import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};

export interface CartResponse {
  statusCode: number;
  message: string;
  data: {
    cart: {
      id: string;
      user_id: string;
      created_at: string;
      updated_at: string;
      status: string;
      items: CartItem[];
    };
    total: number;
  };
}
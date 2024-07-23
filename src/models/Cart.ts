import { CartItem } from "./CartItem";

enum CartStatuses {
  OPEN = "OPEN",
  STATUS = "STATUS",
}

export type Cart = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: CartStatuses;
  items: CartItem[];
};

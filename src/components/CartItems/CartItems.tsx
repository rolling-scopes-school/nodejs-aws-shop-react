import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { CartItem } from "~/models/CartItem";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProducts } from "~/queries/products";
import { useMemo } from "react";

type CartItemsProps = {
  items: CartItem[];
  isEditable: boolean;
};

export default function CartItems({ items, isEditable }: CartItemsProps) {
  const { data = [], isLoading } = useAvailableProducts();
  const totalPrice: number = items.reduce((total, item) => {
    if (!item.price) return total;
    return total + item.price * item.count;
  }, 0);
  const orderIdArr = items.map((item) => item.product_id);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const itemWithData: CartItem[] = data
    .filter((el) => orderIdArr.includes(el.id))
    .map((el) => ({
      product: el,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      count: (items as CartItem[])?.find(
        (item) => (item?.product_id as string) === el.id
      ).count,
    }));

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <List disablePadding>
        {itemWithData.map((cartItem: CartItem) => (
          <ListItem
            sx={{ padding: (theme) => theme.spacing(1, 0) }}
            key={cartItem.product.id}
          >
            {isEditable && <AddProductToCart product={cartItem.product} />}
            <ListItemText
              primary={cartItem.product.title}
              secondary={cartItem.product.description}
            />
            <Typography variant="body2">
              {formatAsPrice(cartItem.product.price)} x {cartItem.count} ={" "}
              {formatAsPrice(cartItem.product.price * cartItem.count)}
            </Typography>
          </ListItem>
        ))}
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">Free</Typography>
        </ListItem>
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {formatAsPrice(totalPrice)}
          </Typography>
        </ListItem>
      </List>
    </>
  );
}

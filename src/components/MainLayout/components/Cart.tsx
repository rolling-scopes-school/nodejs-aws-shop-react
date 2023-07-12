import Badge from "@mui/material/Badge";
import CartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { useCart } from "~/queries/cart";
import { DataReturn } from "~/models/CartItem";
import { stat } from "fs";

export default function Cart () {
  const { data = {} as DataReturn, status} = useCart();
  console.log('Cart', useCart());

  if(status === 'success') {
    console.log('Cart success', useCart(), data);
    const badgeContent = data.cart ? data.cart.items.length : undefined;
    return (
      <IconButton color="inherit" component={Link} to="/cart" size="large">
        <Badge badgeContent={badgeContent} color="secondary">
          <CartIcon />
        </Badge>
      </IconButton>
    );
  }
  console.log('Cart', useCart(), data);
    return (
    <IconButton color="inherit" component={Link} to="/cart" size="large">
        <div>Loading</div>
      </IconButton>
      )
}

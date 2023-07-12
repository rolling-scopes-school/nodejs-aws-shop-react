import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  useDeleteOrder,
  useInvalidateOrders,
  useOrders,
} from "~/queries/orders";
import { useEffect } from "react";
import { Order } from "~/models/Order";

export default function Orders() {
  const { data } = useOrders();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const orderArr = data?.order ?? [];
  const invalidateOrders = useInvalidateOrders();
  const { mutate: deleteOrder } = useDeleteOrder();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell align="right">Items count</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderArr?.map((order: any) => {
            return (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  {order.delivery?.firstName} {order.delivery?.lastName}
                </TableCell>
                <TableCell align="right">{order.cart.items?.length}</TableCell>
                <TableCell align="right">{order.delivery?.address}</TableCell>
                <TableCell align="right">
                  {order.status}
                  {/*{order.statusHistory[order.statusHistory?.length - 1].status}*/}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={order.id}
                  >
                    Manage
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() =>
                      deleteOrder(order.id, { onSuccess: invalidateOrders })
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import * as Yup from "yup";
import { OrderStatus } from "~/constants/order";

export const DeliverySchema = Yup.object({
  firstName: Yup.string().required().default(""),
  lastName: Yup.string().required().default(""),
  address: Yup.string().required().default(""),
  comment: Yup.string().default(""),
}).defined();

export type Address = Yup.InferType<typeof DeliverySchema>;

export const OrderItemSchema = Yup.object({
  productId: Yup.string().required(),
  count: Yup.number().integer().positive().required(),
}).defined();

export type OrderItem = Yup.InferType<typeof OrderItemSchema>;

export const statusHistorySchema = Yup.object({
  status: Yup.mixed<OrderStatus>().oneOf(Object.values(OrderStatus)).required(),
  timestamp: Yup.number().required(),
  comment: Yup.string().required(),
});

export type statusHistory = Yup.InferType<typeof statusHistorySchema>;

export const cartSchema = Yup.object({
  items: Yup.array().defined(),
});

export type Cart = Yup.InferType<typeof cartSchema>;

export const OrderSchema = Yup.object({
  id: Yup.string().required(),
  items: Yup.array().of(OrderItemSchema).defined(),
  delivery: DeliverySchema.required(),
  statusHistory: Yup.array().of(statusHistorySchema).defined(),
  cart: cartSchema.defined(),
  status: Yup.string(),
}).defined();

export type Order = Yup.InferType<typeof OrderSchema>;

import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem, CartItemId } from "~/models/CartItem";
import { Product } from "~/models/Product";

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const res = await axios.get(`${API_PATHS.cart}/profile/cart`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });

    console.log("items", res.data.data.cart.items);
    const availableProducts: Product[] = localStorage.getItem(
      "availableProducts"
    )
      ? JSON.parse(localStorage.getItem("availableProducts") as string)
      : [];
    const result: CartItem[] = [];
    if (availableProducts) {
      res.data.data.cart.items.map((item: CartItemId) => {
        const curProduct = availableProducts.find(
          (product: Product) => product.id === item.productId
        );
        if (curProduct)
          result.push({
            product: {
              description: curProduct.description,
              id: curProduct.id,
              price: curProduct.price,
              title: curProduct.title,
            },
            count: item.count,
          });
      });
    }
    return result ?? res.data.data.cart.items;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) => {
    const { product, count } = values;
    const reqBody = { items: [{ productId: product.id, count }] };
    return axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, reqBody, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });
  });
}

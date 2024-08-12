import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem, Cart } from "~/models/CartItem";

export function useCart() {
  return useQuery<Cart, AxiosError>("cart", async () => {
    const res = await axios.get<Cart>(
      `${API_PATHS.bff}/cart/api/profile/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
    return res.data;
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
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.bff}/cart/api/profile/cart`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

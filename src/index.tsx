import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import axios, { AxiosError } from "axios";
import { LS_KEYS } from "./constants/localStorage";

axios.interceptors.response.use(undefined, (err) => {
  const error = err as AxiosError;
  const { response } = error;
  let message;

  if (
    response?.data &&
    response.data instanceof Object &&
    Object.hasOwn(response.data, "message")
  ) {
    const data = response.data as { message: unknown };
    message = data.message;
  }

  if (response?.status === 401 || response?.status === 403) {
    alert(
      `Authorization failed: ${[response.status, message]
        .filter(Boolean)
        .join(" - ")}`
    );
  }

  return error;
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

const authToken = localStorage.getItem(LS_KEYS.AuthToken) ?? "";

if (!authToken) {
  localStorage.setItem(
    LS_KEYS.AuthToken,
    window.btoa("lobovskiy:TEST_PASSWORD")
  );
}

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

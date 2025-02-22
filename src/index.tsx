import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from '@mui/material';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

import App from "~/components/App/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

async function initializeApp() {

if (import.meta.env.DEV) {
  try {
    const { worker } = await import("~/mocks/browser");
    worker.start({ 
      onUnhandledRequest: "bypass" ,
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });

    console.log('[MSW] Mock Service Worker started successfully');
  }
  catch (error) {
    console.error("[MSW] Failed to initialize Mock Service Worker:", error);
  }
}

const container = document.getElementById("app");

if (!container) {
  throw new Error('Failed to find the root element');
}

  const root = createRoot(container);

  //todo add loading spinner
  root.render(<Typography>Loading...</Typography>);

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
}

initializeApp().catch((error) => {
  console.error('Failed to start application:', error);
  const container = document.getElementById("app");
  if (container) {
    const root = createRoot(container);
    root.render(
      <div>
        Failed to start application: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  } else {
    document.body.innerHTML = `<div>Critical Error: Could not find app container and failed to start application: ${
      error instanceof Error ? error.message : 'Unknown error'
    }</div>`;
  }
});
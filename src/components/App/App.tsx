import { useEffect,useState } from 'react';
import { Routes, Route } from "react-router-dom";
import MainLayout from "~/components/MainLayout/MainLayout";
import PageProductForm from "~/components/pages/PageProductForm/PageProductForm";
import PageOrders from "~/components/pages/PageOrders/PageOrders";
import PageOrder from "~/components/pages/PageOrder/PageOrder";
import PageProductImport from "~/components/pages/admin/PageProductImport/PageProductImport";
import PageCart from "~/components/pages/PageCart/PageCart";
import PageProducts from "~/components/pages/PageProducts/PageProducts";
import { Typography } from "@mui/material";
import API_PATHS from "~/constants/apiPaths";
import axios from "axios";

function isTokenExpired(idToken: string, bufferTime = 60) {
  try {
    const [, payload] = idToken.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp;

    return Date.now() >= (expirationTime - bufferTime) * 1000;
  } catch (error) {
    console.error(error);
    return true;
  }
}

function App() {
  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    const idToken = localStorage.getItem('id_token');

    if (idToken && !isTokenExpired(idToken)) {
      setIsTokenReady(true);
      return;
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    let requestTokenIdUrl;

    if (code) {
      requestTokenIdUrl = `${API_PATHS.tokenexchange}?code=${code}`;
    } else {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        console.error('Refresh token not found in localStorage');
        return;
      } requestTokenIdUrl = `${API_PATHS.tokenexchange}?refresh_token=${refreshToken}`;
    }

    if (requestTokenIdUrl) {
      axios
        .get(requestTokenIdUrl)
        .then(response => {
          const idToken = response.data.message.id_token;
          const refreshToken = response.data.message.refresh_token;

          localStorage.setItem('id_token', idToken);

          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          setIsTokenReady(true);
        })
        .catch(error => console.error(error));
    }
  }, []);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PageProducts isTokenReady={isTokenReady} />} />
        <Route path="cart" element={<PageCart />} />
        <Route path="admin/orders">
          <Route index element={<PageOrders />} />
          <Route path=":id" element={<PageOrder />} />
        </Route>
        <Route path="admin/products" element={<PageProductImport isTokenReady={isTokenReady} />} />
        <Route path="admin/product-form">
          <Route index element={<PageProductForm />} />
          <Route path=":id" element={<PageProductForm />} />
        </Route>
        <Route
          path="*"
          element={<Typography variant="h1">Not found</Typography>}
        />
      </Routes>
    </MainLayout>
  );
}

export default App;

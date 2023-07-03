import Products from "~/components/pages/PageProducts/components/Products";
import Box from "@mui/material/Box";

export default function PageProducts({ isTokenReady }: {isTokenReady: boolean}) {
  return (
    <Box py={3}>
      <Products isTokenReady={isTokenReady}/>
    </Box>
  );
}

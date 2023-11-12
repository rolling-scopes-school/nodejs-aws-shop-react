import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";
import Header from "~/components/MainLayout/components/Header";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © Timur Kaiser (but not really)"}
      <Link color="inherit" href="https://material-ui.com/" underline="hover">
        My Store
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        <Container sx={{ pb: 8 }} maxWidth="md">
          {children}
        </Container>
      </main>
      <Box
        component={"footer"}
        sx={{ bgcolor: (theme) => theme.palette.background.paper, padding: 6 }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Thank you for your purchase!
        </Typography>
        <Copyright />
      </Box>
    </>
  );
};

export default MainLayout;

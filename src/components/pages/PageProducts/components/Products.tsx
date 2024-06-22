import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProducts } from "~/queries/products";
import imagesData from "~/images/data.json";

export default function Products() {
  const { data = [], isLoading } = useAvailableProducts();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {data.map(({ count, ...product }, index) => {
        const img = imagesData.find((img) => img.product_id === product.id);
        return (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                sx={{
                  pt: "66.25%",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                image={img?.source || "images/logo.jpg"}
                title="Image title"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.title}
                </Typography>
                <Typography>{formatAsPrice(product.price)}</Typography>
              </CardContent>
              <CardActions>
                <AddProductToCart product={product} />
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

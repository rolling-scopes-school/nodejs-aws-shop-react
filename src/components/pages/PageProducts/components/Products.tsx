import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProducts } from "~/queries/products";

// Define the character interface
interface Character {
  id: number;
  image: string;
  name: string;
}

export default function Products() {
  const { data = [], isLoading } = useAvailableProducts();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    // Function to fetch random characters
    const fetchRandomCharacters = async () => {
      try {
        // The API has 826 characters (as of last known count)
        // Generate random IDs for the number of products we have
        const randomIds = data.map(() => Math.floor(Math.random() * 826) + 1);

        // Fetch character data
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${randomIds.join(",")}`
        );
        const characterData = await response.json();

        // Handle both single character and multiple characters responses
        const chars = Array.isArray(characterData)
          ? characterData
          : [characterData];
        setCharacters(chars);
      } catch (error) {
        console.error("Error fetching Rick and Morty characters:", error);
      }
    };

    if (data.length > 0) {
      fetchRandomCharacters();
    }
  }, [data]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {data.map(({ count, ...product }, index) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              sx={{ pt: "56.25%" }}
              // image={`https://source.unsplash.com/random?sig=${index}`}
              // title="Image title"
              image={
                characters[index]?.image ||
                "https://images.unsplash.com/1/type-away.jpg"
              }
              title={characters[index]?.name || "Image title"}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {product.title}
              </Typography>
              <Typography>{characters[index]?.name || "name"}</Typography>
              <Typography>{formatAsPrice(product.price)}</Typography>
            </CardContent>
            <CardActions>
              <AddProductToCart product={product} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

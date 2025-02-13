const env = import.meta.env as { [key: string]: string };

const API_PATHS = {
  // product: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  // order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  // import: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  // bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  // cart: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  product: env.VITE_API_PATHS_PRODUCT,
  order: env.VITE_API_PATHS_ORDER,
  import: env.VITE_API_PATHS_IMPORT,
  bff: env.VITE_API_PATHS_BFF,
  cart: env.VITE_API_PATHS_CARD,
};

export default API_PATHS;

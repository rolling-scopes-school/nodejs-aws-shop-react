const BASE_PATH =
  "https://bxap70ethc.execute-api.eu-west-1.amazonaws.com/prod/";

const IMPORT_PATH =
  "https://owxgrms5fl.execute-api.eu-west-1.amazonaws.com/prod/";

const CART_PATH = "http://localhost:4000/api";

const API_PATHS = {
  product: BASE_PATH + "products",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: IMPORT_PATH + "import",
  bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  cart: CART_PATH,
};

export default API_PATHS;

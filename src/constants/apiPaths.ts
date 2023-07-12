const BASE_PATH =
  "https://bxap70ethc.execute-api.eu-west-1.amazonaws.com/prod/";

const IMPORT_PATH =
  "https://owxgrms5fl.execute-api.eu-west-1.amazonaws.com/prod/";

const CART_PATH =
  " https://wolxk0qmh1.execute-api.eu-west-1.amazonaws.com/prod/api";

const API_PATHS = {
  product: BASE_PATH + "products",
  order: CART_PATH,
  import: IMPORT_PATH + "import",
  bff: BASE_PATH + "products",
  cart: CART_PATH,
};

export default API_PATHS;

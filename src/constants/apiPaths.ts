const BASE_PATH =
  "https://bxap70ethc.execute-api.eu-west-1.amazonaws.com/prod/";

const IMPORT_PATH =
  "https://owxgrms5fl.execute-api.eu-west-1.amazonaws.com/prod/";

const API_PATHS = {
  product: BASE_PATH + "products",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: IMPORT_PATH + "import",
  bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  cart: "https://.execute-api.eu-west-1.amazonaws.com/dev",
};

export default API_PATHS;

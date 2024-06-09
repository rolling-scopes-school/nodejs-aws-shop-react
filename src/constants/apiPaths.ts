const prefix = import.meta.env.VITE_API_PREFIX || ".execute-api2";

const API_PATHS = {
  product: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  order: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  import: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  bff: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  cart: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
};

export default API_PATHS;

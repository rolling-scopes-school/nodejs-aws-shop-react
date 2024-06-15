const prefix = import.meta.env.VITE_API_PREFIX || ".execute-api2";
const awsAPI = "https://sm7jmgfua1.execute-api.us-east-1.amazonaws.com/prod";

const API_PATHS = {
  product: awsAPI,
  order: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  import: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  bff: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
  cart: `https://${prefix}.eu-west-1.amazonaws.com/dev`,
};

export default API_PATHS;

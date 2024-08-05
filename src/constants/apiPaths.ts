import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const statusResponse = error?.response?.status;
    if (statusResponse === 401 || statusResponse === 403) {
      alert(`Status ${statusResponse} ${error?.response?.data?.message}`);
    }

    return Promise.reject(error.response);
  }
);

const API_PATHS = {
  product: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: "https://saselr9wi3.execute-api.eu-central-1.amazonaws.com/prod/",
  bff: "https://ul03mg0kb5.execute-api.eu-central-1.amazonaws.com/prod",
  cart: "http://ihartsykala-cart-api-develop.us-west-2.elasticbeanstalk.com",
};

export default API_PATHS;

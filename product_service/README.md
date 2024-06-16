# Task 3

Task: https://github.com/rolling-scopes-school/aws/blob/main/aws-developer/03_serverless_api/task.md

### What was done?
- Created two Lambda functions: `getProductsList` and `getProductsById`.
- Integrated these functions with API Gateway.
- Added CORS support.
- Created Swagger documentation.
- Added unit tests for Lambda functions.

### Additional scope
- Swagger documentation: added `openapi.yaml` file.
- Unit tests: created tests for `getProductsList` and `getProductsById`.
- Code is separated into different modules for better maintainability.

### How to run Swagger locally?

1. Ensure you have the necessary dependencies installed:
   * `npm install swagger-ui-express yamljs express --legacy-peer-deps`
2. Run the Swagger server:
   * `npm run start-swagger`

### Links
- [Product Service API](https://1nsh7fxo91.execute-api.us-east-1.amazonaws.com/prod/products)
- [Product Service API for id = 1](https://1nsh7fxo91.execute-api.us-east-1.amazonaws.com/prod/products/1)
- [Frontend](https://d21a3jmx00scyq.cloudfront.net/)
- [Swagger](http://localhost:3000/api-docs)
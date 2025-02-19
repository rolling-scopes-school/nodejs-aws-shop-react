const cdk = require("aws-cdk-lib");
const { ShopWebAppStack } = require("../lib/shop-web-app-stack");

const app = new cdk.App();
new ShopWebAppStack(app, "ShopWebAppStack", {
  env: { region: "eu-central-1" },
});

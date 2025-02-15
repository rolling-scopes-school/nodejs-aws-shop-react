const cdk = require('aws-cdk-lib');
const { AwsDeployStack } = require('../lib/aws-deploy-stack');

const app = new cdk.App();
new AwsDeployStack(app, 'aws-shop-stack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: 'eu-central-1',
  }
});

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

# AWS S3 & CloudFront Deployment

## Deployed Application Links

- **CloudFront URL:** [https://d3lu9acxdpz9hy.cloudfront.net/](https://d3lu9acxdpz9hy.cloudfront.net/)
- **S3 Website URL:** [https://cdkstack-deploymentfrontendbucket67ceb713-xxcfkqtuefhd.s3.amazonaws.com/](https://cdkstack-deploymentfrontendbucket67ceb713-xxcfkqtuefhd.s3.amazonaws.com/) _(should return 403 Access Denied)_

## Deployment Steps

### Manual Deployment

1. Created an S3 bucket and configured it for website hosting.
2. Uploaded the MyShop! application manually.
3. Configured CloudFront to serve the app securely.
4. Invalidated CloudFront cache after making UI changes.

### Automated Deployment with AWS CDK

1. Created an AWS CDK stack to automate the deployment.
2. The stack:
   - Creates an S3 bucket.
   - Configures a CloudFront distribution with OAI.
   - Uses `BucketDeployment` to upload files automatically.
   - Triggers CloudFront cache invalidation after deployment.
3. Verified that `cdk destroy` removes all resources.

## How to Deploy

To deploy the application, run:

```sh
npm run deploy
```

```sh
npm run destroy
```
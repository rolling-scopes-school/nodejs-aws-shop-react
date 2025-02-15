# React-shop-cloudfront

This is frontend starter project for nodejs-aws mentoring program. It uses the following technologies:

- [Vite](https://vitejs.dev/) as a project bundler
- [React](https://beta.reactjs.org/) as a frontend framework
- [React-router-dom](https://reactrouterdotcom.fly.dev/) as a routing library
- [MUI](https://mui.com/) as a UI framework
- [React-query](https://react-query-v3.tanstack.com/) as a data fetching library
- [Formik](https://formik.org/) as a form library
- [Yup](https://github.com/jquense/yup) as a validation schema
- [Vitest](https://vitest.dev/) as a test runner
- [MSW](https://mswjs.io/) as an API mocking library
- [Eslint](https://eslint.org/) as a code linting tool
- [Prettier](https://prettier.io/) as a code formatting tool
- [TypeScript](https://www.typescriptlang.org/) as a type checking tool

## Available Scripts

### `start`

Starts the project in dev mode with mocked API on local environment.

### `build`

Builds the project for production in `dist` folder.

### `preview`

Starts the project in production mode on local environment.

### `test`, `test:ui`, `test:coverage`

Runs tests in console, in browser or with coverage.

### `lint`, `prettier`

Runs linting and formatting for all files in `src` folder.

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
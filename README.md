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

## What was done?

### Manual Deployment: 
- S3 bucket has been created and uploaded to the bucket and is available though the Internet.
- CloudFront distribution is created and he site is served now with CloudFront and is available through the Internet over CloudFront URL.

### Automated Deployment:
- S3 bucket creation, website deployment, CloudFront Distribution and Invalidation added and configured by using AWS CDK. [Link](https://github.com/Hakimbek/nodejs-aws-shop-react/blob/aws-2-serving-spa/cdk-deployment/cdk_deployment/cdk_deployment_stack.py) to stack file which is responsible for auto deploy.

## Link to FE PR
You can find links to CloudFront and S3-website [here](https://github.com/Hakimbek/nodejs-aws-shop-react/tree/aws-2-serving-spa), in my forked repo.

## URL

CloudFront URL: https://dbckq8zyvfoi3.cloudfront.net

S3-website URL: https://aws-task-2-manual-deploy.s3.eu-north-1.amazonaws.com/index.html

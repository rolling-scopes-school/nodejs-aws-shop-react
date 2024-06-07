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

# Task 2 (Serve SPA in AWS S3 and Cloudfront Services)

+ Installed the latest version of AWS CDK (https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).
+ Configured credentials for AWS to make them accessible for AWS CLI & CDK.
+ Forked the React Shop single-page app from https://github.com/rolling-scopes-school/nodejs-aws-shop-react.
+ Installed dependencies (need to use npm i --force).

[Architecture] (Architecture.pdf)

# Task 2.1
## Manual Deployment

1) In the AWS Console, created and configured an S3 bucket
[S3 bucket](https://shop-web-app.s3.eu-central-1.amazonaws.com/index.html/)

2) Created a CloudFront distribution for app 
[Cloud Front](https://d2zyxqnb5qq3f8.cloudfront.net/)

3) AWS CLI commands:
- aws --version
- aws s3 ls
- aws s3api get-bucket-policy --bucket shop-web-app
- aws cloudfront list-distributions
- curl -o NUL -s -w "Total: %{time_total}s\n" https://d2zyxqnb5qq3f8.cloudfront.net
Total: 0.124938s
- curl -o NUL -s -w "Total: %{time_total}s\n" https://shop-web-app.s3.eu-central-1.amazonaws.com/index.html
Total: 0.177813s
- curl -o $null -s -w "Total: %{time_total}s`n" https://d2zyxqnb5qq3f8.cloudfront.net
Total: 0.036126s`n
- curl -o $null -s -w "Total: %{time_total}s`n" https://shop-web-app.s3.eu-central-1.amazonaws.com/index.html
Total: 0.126337s`n

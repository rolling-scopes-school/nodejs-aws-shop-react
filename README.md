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

## Deploy links

> CloudFront Url: <https://d2tbewbqvvmzls.cloudfront.net>
>
> S3 bucket site : <http://rss-my-shop-auto-deploy.s3-website-eu-west-1.amazonaws.com>
>
> S3 bucket site returns 403 because hasn't public access and is only available via CloudFront

## Available Scripts

### `start`

Starts the project in dev mode with mocked API on local environment.

### `build`

Builds the project for production in `dist` folder.

### `build:cdk:bootstrap`

Builds the project for production in `dist` folder and makes CDK bootstrap. CDK bootstrapping is not available if the project has not yet been builded.

### `build:cloudfront:deploy`

Builds the project for production in `dist` folder and deploys it to AWS.

### `cloudfront:deploy`

Deploys `dist` folder to AWS.

### `cloudfront:remove`

Removes all project infrastructure from AWS.

### `preview`

Starts the project in production mode on local environment.

### `test`, `test:ui`, `test:coverage`

Runs tests in console, in browser or with coverage.

### `lint`, `prettier`

Runs linting and formatting for all files in `src` folder.

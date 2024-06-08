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

## Task 2
### Manual deploy
S3 with public access - https://task-2-public.s3.eu-north-1.amazonaws.com/index.html

CloudFront - https://d1mgcuiw0j09cf.cloudfront.net
S3 that above CloudFront is using (Restricted direct access) - https://rsschool.s3.eu-north-1.amazonaws.com/index.html

### CDK deploy
S3 - https://cdkjavastack-rsmodule2bucket9e5d6dd3-vuevhxcvpnge.s3.amazonaws.com/index.html
CloudFront - https://d2zt3xe06mzv8f.cloudfront.net
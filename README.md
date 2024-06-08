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

## To start:

- Install dependencies:
## npm i

- Build the project:
## npm run build

- ## For deployment:

First go to cdk folder 
### `cd ./cdk`

then run deploy 
### `delploy`


### URLs to website:

### Task 2.1 Manual Deployment

#### S3 bucket website: 

https://my-shop-react-bucket.s3.eu-west-1.amazonaws.com/index.html

#### CloudFront website: 

https://d18qk7dy2mngew.cloudfront.net/

### Task 2.2 Automated Deployment

#### CloudFront website: 

https://d3r5s5dc64z7tm.cloudfront.net

# My-Store-App

This is the frontend starter project for the Node.js AWS mentoring program. It uses the following technologies:

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

Starts the project in dev mode with mocked API on the local environment.

### `build`

Builds the project for production in the `dist` folder.

### `preview`

Starts the project in production mode on the local environment.

### `cdk:deploy`

Builds the project and deploys it using AWS CDK.

### `cdk:destroy`

Destroys the AWS CDK deployment.

### `test`

Runs tests in the console.

### `test:ui`

Runs tests in a browser UI.

### `test:coverage`

Runs tests with coverage.

### `lint`

Runs linting for all files in the `src` folder.

### `prettier`

Formats all files in the `src` folder.

## AWS CDK Deployment

### Bootstrapping the Environment

Before deploying the project using AWS CDK, you need to bootstrap the environment. This step sets up the necessary resources that AWS CDK requires. Run the following command:

```bash
cdk bootstrap aws://590183744920/eu-central-1



### Task 2.1 (Manual Deployment)
- [x] In the AWS Console create and configure an S3 bucket where you will host your app.
  - bucket name: `rs-app-test-1`
  - region: `us-east-1`
- [x] Build and manually upload the MyShop.
- [x] Create a CloudFront distribution for your app.
- [x] Make some minor but visible changes in the app.
  - Commented `import.meta.env.DEV` to render product list in production.
### Task 2.2 (Automated Deployment)
- [x] Add and configure S3 bucket creation and website deployment using AWS CDK. 
- [x] Add necessary npm script(s) to build and deploy your app from your machine in an automated way.
  - `yarn build` - Build application.
  - `yarn deploy:s3` - separately upload **dist** folder to **S3**.
- [x] Destroy the created AWS infrastructure (S3 bucket and CloudFront distribution) from the previous part and steps. 
Make sure nothing is left.
- [x] Add and configure CloudFront Distribution and Invalidation using AWS CDK. Add necessary npm script(s) to build, 
upload to your S3 bucket, and invalidate CloudFront cache from your machine in an automated way.
  - `yarn deploy:cf` - separately **CloudFront** invalidation.
  - `yarn deploy` Build application. Completely upload **dist** folder to **S3**. **CloudFront** invalidation.
### Task 2.3:
- Store the links to CloudFront URL and S3-website in README.md file.
  - [x] URL S3-website. - http://rs-app-test-1.s3-website-us-east-1.amazonaws.com/
  - [x] URL CloudFront - https://d2xksn4h3reedh.cloudfront.net/
- [x] Commit all your work to separate branch (e.g. task-2 from the latest main) in your own repository.

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

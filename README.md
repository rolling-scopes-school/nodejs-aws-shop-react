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

[Architecture](https://github.com/Tati-Moon/nodejs-aws-shop-react/blob/feature/task2/Architecture.pdf)

# Task 2.1
## Manual Deployment

1) In the AWS Console, created and configured an S3 bucket
[S3 bucket](https://shop-web-app.s3.eu-central-1.amazonaws.com/index.html/)

2) Created a CloudFront distribution for app 
[Cloud Front](https://d2zyxqnb5qq3f8.cloudfront.net/)

3) AWS CLI commands:
```sh
`aws --version`
`aws s3 ls`
`aws s3api get-bucket-policy --bucket shop-web-app`
`aws cloudfront list-distributions`
```
```sh
curl -o NUL -s -w "Total: %{time_total}s\n" https://d2zyxqnb5qq3f8.cloudfront.net
# Total: 0.124938s

curl -o NUL -s -w "Total: %{time_total}s\n" https://shop-web-app.s3.eu-central-1.amazonaws.com/index.html
# Total: 0.177813s

curl -o $null -s -w "Total: %{time_total}s\n" https://d2zyxqnb5qq3f8.cloudfront.net
# Total: 0.036126s

curl -o $null -s -w "Total: %{time_total}s\n" https://shop-web-app.s3.eu-central-1.amazonaws.com/index.html
# Total: 0.126337s
```

# Task 2.2

Used [AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
1) Created new folder, for example 'cdk'
2) Installed 
* `npm install -g aws-cdk`
3) Configured 
* `cdk init app --language csharp`
* `cdk bootstrap` or `cdk bootstrap aws://ID/REGION`
 (
    delete options: 
    * `aws cloudformation describe-stacks`
    * `aws cloudformation delete-stack --stack-name CdkStackLayerStack_NAMES`
    * `aws cloudformation delete-stack --stack-name CDKToolkit`
    * `npm uninstall -g aws-cdk`
)
4) Added new options to CdkStack.cs and Program.cs
# core for AWS CDK (Program.cs)
```csharp
public static void Main(string[] args)
{
    var app = new App();
    new CdkStack(app, "CdkStack", new StackProps
    {
        Env = new Environment
        {
            Account = "ACCOUNT_ID",
            Region = "eu-central-1",
        }
    });
    app.Synth();
}
```
# CdkStack.cs
```csharp
internal CdkStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
{
    // Create the S3 bucket
    var bucket = new Bucket(this, $"{BucketId}-bucket", new BucketProps
    {
        ...
    });

    var oai = new OriginAccessIdentity(this, "OAI");

    // Create an IAM policy statement to allow GetObject action on the S3 bucket
    var bucketPolicyStatement = new PolicyStatement(new PolicyStatementProps
    {
        ...
    });

    bucket.AddToResourcePolicy(bucketPolicyStatement);

    // Create CloudFront distribution
    var distribution = new CloudFrontWebDistribution(this, $"{BucketId}-distribution", new CloudFrontWebDistributionProps
    {
        OriginConfigs = new[]
        {
          ...
        }
    });

    // Deploy files to the S3 bucket
    new BucketDeployment(this, $"{BucketId}-deployment", new BucketDeploymentProps
    {
        ...
    });

    // Export CloudFront distribution ID
    new CfnOutput(this, "DistributionURL", new CfnOutputProps
    {
        Value = distribution.DistributionDomainName,
        Description = "CloudFront distribution"
    });

    // Output S3 bucket URL
    new CfnOutput(this, "BucketURL", new CfnOutputProps
    {
        Value = bucket.BucketWebsiteUrl,
        Description = "The URL of the S3 bucket website endpoint"
    });
}
```

5) Builded C# project
* `dotnet build src` compile this app
* `cdk deploy`       deploy this stack to your default AWS account/region
* `cdk diff`         compare deployed stack with current state
* `cdk synth`        emits the synthesized CloudFormation template
6) Added options to package.json:
   "scripts": {
    "cdk-deploy": "cdk deploy --app \"cdk_dest/cdk.out\"",
    "deploy": "npm run build && npm run cdk-deploy"
    }
7) Result of operation  'cdk deploy --all'
[Settings] (img.png)
8) Checked links:
a. [S3 bucket link](http://shop-web-app-automated.s3-website.eu-central-1.amazonaws.com/) - the 403 error should be shown
b. [Cloud Front link](https://dfmqzjmg0ul9o.cloudfront.net/) - should be available.

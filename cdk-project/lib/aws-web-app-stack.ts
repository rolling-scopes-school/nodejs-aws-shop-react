import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import * as deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cf from "aws-cdk-lib/aws-cloudfront";

export class AWSWebAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create or reference the S3 bucket
    const bucketName = "rr-aws-spa-automated";
    const bucket = new s3.Bucket(this, "AWSWebAppBucket", {
      bucketName: bucketName,
    });

    // Create an Origin Access Identity for CloudFront to access the S3 bucket
    const originAccessIdentity = new cf.OriginAccessIdentity(
      this,
      "AWSWebAppProjectOAI",
      {
        comment: `OAI for ${bucket.bucketName}`,
      }
    );

    // Grant read access to CloudFront
    bucket.grantRead(originAccessIdentity);

    // Create a CloudFront distribution to serve the S3 bucket content
    const cloudfront = new cf.Distribution(this, "AWSWebAppDistribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    // Deploy the web application to the S3 bucket and invalidate CloudFront cache
    new deployment.BucketDeployment(this, "DeployWebApp", {
      destinationBucket: bucket,
      sources: [deployment.Source.asset("../dist")],
      distribution: cloudfront,
      distributionPaths: ["/*"],
    });

    // Output the CloudFront distribution domain name
    new cdk.CfnOutput(this, "CloudFrontDomain", {
      value: cloudfront.distributionDomainName,
    });
  }
}

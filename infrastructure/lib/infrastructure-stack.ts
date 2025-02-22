import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from 'aws-cdk-lib';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create an S3 bucket to store your website
    const websiteBucket = new s3.Bucket(this, 'MyReactShop', {
      removalPolicy: RemovalPolicy.DESTROY, // Only for development
      autoDeleteObjects: true, // Only for development
    });


   // Create CloudFront distribution
   const distribution = new cloudfront.Distribution(this, 'Distribution', {
    defaultBehavior: {
      origin: new origins.S3Origin(websiteBucket),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    defaultRootObject: 'index.html',
    errorResponses: [
      {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html' // For SPA routing
      }
    ]
  });

    // Deploy site contents to S3 and invalidate CloudFront
    new s3deploy.BucketDeployment(this, 'MyReactShop', {
      sources: [s3deploy.Source.asset('../build')], // Path to your React build folder
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ['/*'] // Invalidate everything
    });

    // Output the CloudFront URL and Distribution ID
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
  }
}

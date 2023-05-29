import * as cdk from 'aws-cdk-lib';
import {
  aws_s3 as s3,
  aws_s3_deployment,
  aws_cloudfront,
  aws_cloudfront_origins,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket = new s3.Bucket(
      this,
      'nodejs-aws-shop-react-s3-automated-private',
      {
        accessControl: s3.BucketAccessControl.PRIVATE,
      }
    );

    new aws_s3_deployment.BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [
        aws_s3_deployment.Source.asset(path.join(__dirname, '../../dist')),
      ],
    });

    const originAccessIdentity = new aws_cloudfront.OriginAccessIdentity(
      this,
      'OriginAccessIdentity'
    );
    bucket.grantRead(originAccessIdentity);

    new aws_cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(bucket, {
          originAccessIdentity,
        }),
      },
    });

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

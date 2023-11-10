import * as cdk from 'aws-cdk-lib';
import {aws_s3 as s3, aws_iam as iam, aws_cloudfront as cloudfront, aws_s3_deployment as s3deploy} from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cloudFrontAOI = new cloudfront.OriginAccessIdentity(this, 'JSCC-OAI')

    const siteBucket = new s3.Bucket(this, 'nodejs-aws-shop-react-cindy1', {
      bucketName: 'nodejs-aws-shop-react-cindy1',
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
actions: ["S3:GetObject"],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudFrontAOI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'JSCC-distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudFrontAOI
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    })

    new s3deploy.BucketDeployment(this, 'JSCC-Bucket-Deployment', {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"]
    })

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

import * as cdk from 'aws-cdk-lib';
import * as deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'AWSShopReact', {
      bucketName: 'maria-velesiuk-task2',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true
    });

    const oai = new cloudfront.OriginAccessIdentity(this, 'AWSShopReactOAI');

    s3Bucket.grantRead(oai);

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "AWSShopReactDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: s3Bucket,
              originAccessIdentity: oai,
            },
            
            behaviors: [
              {
                isDefaultBehavior: true,
                viewerProtocolPolicy:
                  cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                compress: false,
              },
            ],
          },
        ]
      }
    );

    new deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [deploy.Source.asset("../dist")],
      destinationBucket: s3Bucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    });

  }

}

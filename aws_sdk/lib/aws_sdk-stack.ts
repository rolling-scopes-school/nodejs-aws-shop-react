import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';

export class AwsSdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

       const bucket = new s3.Bucket(this, 'AwsReactWebAppBucket', {
        bucketName: 'liza-aws-react-web-app-bucket',
        websiteIndexDocument: 'index.html',
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
      });

      const distribution = new cloudfront.Distribution(this, 'AwsReactWebAppDistribution', {
        defaultBehavior: {
          origin: new cloudfrontOrigins.S3Origin(bucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
      });
  
      new s3Deployment.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3Deployment.Source.asset('../dist')],
        destinationBucket: bucket,
        distribution,
        distributionPaths: ['/*'],
      });
  
      new cdk.CfnOutput(this, 'BucketURL', {
        value: bucket.bucketWebsiteUrl,
        description: 'The URL of the website',
      });

      new cdk.CfnOutput(this, 'DistributionDomainName', {
        value: distribution.distributionDomainName,
        description: 'The domain name of the CloudFront distribution',
      });
  
      new cdk.CfnOutput(this, 'DistributionId', {
        value: distribution.distributionId,
        description: 'The ID of the CloudFront distribution',
      });
  }
}

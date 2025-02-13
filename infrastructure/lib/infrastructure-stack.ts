import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { RemovalPolicy } from 'aws-cdk-lib';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = 'nodejs-aws-shop-rsschool';
    const environment = 'dev';
    const bucketName = `${projectName}-${environment}-bucket`;
    const deploymentName = `${projectName}-${environment}-deployment`;
    const distributionName = `${projectName}-${environment}-distribution`;

    // Create S3 bucket without public access
    const websiteBucket = new s3.Bucket(this, bucketName, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // Do not allow public access: direct access will return 403
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    // Create an Origin Access Identity for CloudFront
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    // Grant CloudFront read access via the OAI
    websiteBucket.grantRead(oai);

    // Create CloudFront distribution using the private S3 bucket
    const distribution = new cloudfront.Distribution(this, distributionName, {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    // Deploy site contents to S3
    new s3deploy.BucketDeployment(this, deploymentName, {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    // Outputs: Only CloudFront is exposed
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name'
    });
  }
}

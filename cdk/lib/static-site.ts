import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class StaticSite extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'CDK-OAI');
      
    const siteBucket = new s3.Bucket(this, 'CDKStaticBucket', {
        bucketName: 'rs-kseniari-s3-bucket',
        websiteIndexDocument: 'index.html',
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
      
    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects('*')],
        principals:[new iam.CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'CDK-distribution', {
        originConfigs: [{
            s3OriginSource: {
                s3BucketSource: siteBucket,
                originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [{
                isDefaultBehavior: true
            }]
        }]
    })
      
    new s3deploy.BucketDeployment(this, 'CDK-Deployment', {
        sources: [s3deploy.Source.asset('../dist')],
        destinationBucket: siteBucket,
        distribution,
        distributionPaths: ['/*']
    })
  }
}
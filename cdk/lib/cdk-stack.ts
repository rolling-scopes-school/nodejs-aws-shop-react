//@ts-nocheck
import { Construct, Stack } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';

export class CdkStack extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'JSS-OAI');

    const siteBucket = new s3.Bucket(this, 'JSCCStaticBucket', {
      bucketName: 'js-cc-cloudfront-s3-sobchanka',
      publicReadAccess: false,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    siteBucket.addToResourcePolicy( new iam.PolicyStatement({
      actiions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'JSCC-distribution', {
      originConfigs:[{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudFrontOAI,
        },
        behaviors: [{isDefaultBehavior: true}],
      }]
    });

    new s3deploy.BucketDeployment(this, 'JSCC-Bucket-Deployment', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}

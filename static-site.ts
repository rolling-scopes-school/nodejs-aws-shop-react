#!/usr/bin/env node
//@ts-nocheck
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Stack } from '@aws-cdk/core';

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'JSCCS-OAI');

    const siteBUcket = new s3.Bucket(this, 'NewJSCCStaticBucket', {
      bucketName: 'jscc-static-site-hw-techleaduz',
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBUcket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBUcket.arnForObjects('*')],
      principals:[new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'JSCCS-distribution-new', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBUcket,
          originAccessIdentity: cloudfrontOAI,
        },
        behaviors: [{ isDefaultBehavior: true }],
      }]
    });

    new s3deploy.BucketDeployment(this, 'JSCCS-Bucket-deployment', {
      sources: [s3deploy.Source.asset('./website')],
      destinationBucket: siteBUcket,
      distribution,
      distributionPaths: ['/*'],
    })
  }
}

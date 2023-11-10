#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ShopFEStack', { env: { region: 'eu-north-1' } });

const bucket = new s3.Bucket(stack, 'ShopFEBucket', { bucketName: 'shop-fe-bucket' });

const originAccessIdentity = new cf.OriginAccessIdentity(stack, 'ShopFEBucketOAI', { comment: bucket.bucketName });

bucket.grantRead(originAccessIdentity);

const cloudfront = new cf.Distribution(stack, 'ShopFEDistribution', {
    defaultBehavior: {
        origin: new origins.S3Origin(bucket, { originAccessIdentity }),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    defaultRootObject: 'index.html',
});

new deployment.BucketDeployment(stack, 'ShopFEDeployment', {
    destinationBucket: bucket,
    sources: [deployment.Source.asset('../dist')],
    distribution: cloudfront,
    distributionPaths: ['/*'],
});

new cdk.CfnOutput(stack, 'Domain URL', {
    value: cloudfront.distributionDomainName,
});
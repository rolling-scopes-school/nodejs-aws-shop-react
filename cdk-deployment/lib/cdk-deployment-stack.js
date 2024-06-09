#!/usr/bin/env node

const { Stack } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const cloudFront = require('aws-cdk-lib/aws-cloudfront');
const iam = require('aws-cdk-lib/aws-iam');
const s3Deployment = require('aws-cdk-lib/aws-s3-deployment');

class CdkDeploymentStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);


    const siteBucket = new s3.Bucket(this, 'rs-aws-cloud-developer-task-2-la', {
      bucketName: 'rs-aws-cloud-developer-task-2-la-s3',
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const cloudfrontOAI = new cloudFront.OriginAccessIdentity(this, 'rs-aws-cloud-developer-task-2-la-OAI');

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('*')],
        principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      }),
    );

    const distribution = new cloudFront.CloudFrontWebDistribution(this, 'rs-aws-cloud-developer-task-2-cloudfront-distribution-la', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudfrontOAI,
        },
        behaviors: [{ 
          isDefaultBehavior: true 
        }],
      }],
    });

    new s3Deployment.BucketDeployment(this, 'rs-aws-cloud-developer-task-2-bucket-deployment-la', {
      sources: [s3Deployment.Source.asset('../dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}

module.exports = { CdkDeploymentStack }
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'MyCdkRsAwsShop', {
    env: { region: 'eu-west-1' },
});

const bucket = new s3.Bucket(stack, 'WebAppCdkBucket', {
    bucketName: 'cdk-rs-aws-shop',
});

const originAccessIdentity = new cf.OriginAccessIdentity(stack, 'WebAppBucketOAI', {
    comment: bucket.bucketName,
});
bucket.grantRead(originAccessIdentity);

const cloudfront = new cf.Distribution(stack, 'WebAppDistribution', {
    defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
            originAccessIdentity,
        }),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    defaultRootObject: 'index.html',
    errorResponses: [
        {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
        },
    ]
});

new deployment.BucketDeployment(stack, 'DeployWebApp', {
    destinationBucket: bucket,
    sources: [deployment.Source.asset('./dist')],
    distribution: cloudfront,
    distributionPaths: ['/*'],
});

new cdk.CfnOutput(stack, 'Domain URL', {
    value: cloudfront.distributionDomainName,
});
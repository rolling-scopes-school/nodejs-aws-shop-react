import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ShopFrontendStack', {
    env: { region: 'eu-north-1' }
});

const bucket = new s3.Bucket(stack, 'ShopBucket', {
    bucketName: "at-shop-bucket"
});

const originAccessIdentity = new cf.OriginAccessIdentity(stack, 'ATShopFrontendOAI', {
    comment: bucket.bucketName
});
bucket.grantRead(originAccessIdentity);

const cloudfront = new cf.Distribution(stack, 'ATShopFrontendDistribution', {
    defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
            originAccessIdentity
        }),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.HTTPS_ONLY
    },
    defaultRootObject: 'index.html',
    errorResponses: [
        {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html'
        }
    ]
})

new deployment.BucketDeployment(stack, 'ATShopFrontendDeployment', {
    destinationBucket: bucket,
    distribution: cloudfront,
    sources: [deployment.Source.asset('./dist')],
    distributionPaths: ['/*']
});

new cdk.CfnOutput(stack, 'Domain URL', {
    value: cloudfront.distributionDomainName
});
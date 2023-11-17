import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, "AwsCourseAlexStack", {
    env: { region: 'eu-west-1' }
})

const bucket = new s3.Bucket(stack, "AwsCourseAlexBucket", {
    bucketName: "rs-aws-course-alex-bucket"
})

const originAccessIdentity = new cloudfront.OriginAccessIdentity(stack, "AwsCourseAlexOAI", {
    comment: bucket.bucketName
})

bucket.grantRead(originAccessIdentity)

const clfront = new cloudfront.Distribution(stack, "AwsCourseAlexDistribution", {
    defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
            originAccessIdentity
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    defaultRootObject: "index.html",
    errorResponses: [
        {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
        },
    ],
})

new s3deploy.BucketDeployment(stack, "DeployAwsCourseAlex", {
    destinationBucket: bucket,
    sources: [s3deploy.Source.asset("../dist")],
    distribution: clfront,
    distributionPaths: ["/*"],
})

new cdk.CfnOutput(stack, "Domain URL", {
    value: clfront.distributionDomainName
})

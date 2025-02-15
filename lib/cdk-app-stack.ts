import * as cdk from "aws-cdk-lib";
import {aws_cloudfront, aws_iam, aws_s3 as s3, aws_s3_deployment, RemovalPolicy, Stack} from "aws-cdk-lib";
// import {Site} from "./site";
import {Construct} from "constructs";
import {S3BucketOrigin} from "aws-cdk-lib/aws-cloudfront-origins";

export class CdkAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id,  props);

        const oai = new aws_cloudfront.OriginAccessIdentity(this, 'OAI');

        const bucket = new s3.Bucket(this, "SiteBucket", {
            removalPolicy: RemovalPolicy.DESTROY,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            websiteIndexDocument: "index.html",
            versioned: false,
            autoDeleteObjects: true
        });

        bucket.addToResourcePolicy(new aws_iam.PolicyStatement({
            actions: ["s3:GetObject"],
            resources: [bucket.arnForObjects("*")],
            principals: [new aws_iam.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));


        const origin = S3BucketOrigin.withOriginAccessIdentity(bucket, {
            originAccessIdentity: oai,
        });

        const distribution = new aws_cloudfront.Distribution(this, "SiteDistribution", {
            defaultBehavior: {
                origin: origin
            }
        });

        new aws_s3_deployment.BucketDeployment(this, "DeploySite", {
            sources: [aws_s3_deployment.Source.asset("./src")],
            destinationBucket: bucket,
            distribution: distribution,
            distributionPaths: ["/*"]
        });
    }
}

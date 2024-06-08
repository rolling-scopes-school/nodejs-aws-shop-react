import { Construct } from "constructs";
import {
    aws_s3 as s3,
    aws_iam as iam,
    aws_cloudfront as cloudfront,
    aws_s3_deployment as s3deploy,
    Stack,
    StackProps,
} from "aws-cdk-lib";

export class StaticSite extends Stack{
    constructor(parent: Construct, name: string, props: StackProps) {
        super(parent, name, props);

        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "JSCC-OAI")

        const siteBucket = new s3.Bucket(this, "JSCCStaticBucket", {
            bucketName: "my-custom-rs-app",
            websiteIndexDocument: "index.html",
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        })

        siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ["S3:GetObject"],
            resources: [siteBucket.arnForObjects("*")],
            principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }))

        const distribution = new cloudfront.CloudFrontWebDistribution(this, "JSCC-distribution", {
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: siteBucket,
                    originAccessIdentity: cloudfrontOAI
                },
                behaviors: [{
                    isDefaultBehavior: true
                }]
            }]
        })

        new s3deploy.BucketDeployment(this, "JSCC-Bucket-Deployment", {
            sources: [s3deploy.Source.asset("../dist")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        })
    }
}
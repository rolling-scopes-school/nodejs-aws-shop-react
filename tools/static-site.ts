import {Construct} from "constructs";
import {aws_cloudfront, aws_iam, aws_s3, aws_s3_deployment} from "aws-cdk-lib";

export class StaticSite extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const cloudFrontOAI = new aws_cloudfront.OriginAccessIdentity(this, "skreepatch-OAI")

        const siteBucket = new aws_s3.Bucket(this, "SkreepatchBucket", {
            bucketName: 'skreepatch-cloudfront-s3',
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
        });

        siteBucket.addToResourcePolicy(new aws_iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [siteBucket.arnForObjects('*')],
            principals: [new aws_iam.CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));

        const distribution = new aws_cloudfront.CloudFrontWebDistribution(this, "skreepatch-distribution", {
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: siteBucket,
                    originAccessIdentity: cloudFrontOAI,
                },
                behaviors:[{
                    isDefaultBehavior: true,
                }]
            }]
        })

        new aws_s3_deployment.BucketDeployment(this, "skreepatch-bucket-deployment", {
            sources: [aws_s3_deployment.Source.asset("./dist")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*']
        })
    }
}

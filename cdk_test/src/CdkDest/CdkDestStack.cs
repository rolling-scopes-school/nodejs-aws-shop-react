using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3.Deployment;
using Amazon.CDK.AWS.S3;
using Constructs;

namespace Cdk
{
    public class CdkStack : Stack
    {
        private const string BucketId = "shop-web-app";

        internal CdkStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // Create the S3 bucket
            var bucket = new Bucket(this, $"{BucketId}-bucket", new BucketProps
            {
                BucketName = $"{BucketId}-automated",
                WebsiteIndexDocument = "index.html",
                RemovalPolicy = RemovalPolicy.DESTROY,
                AutoDeleteObjects = true,
                PublicReadAccess = false,
                BlockPublicAccess = BlockPublicAccess.BLOCK_ALL
            });

            var oai = new OriginAccessIdentity(this, "OAI");

            // Create an IAM policy statement to allow GetObject action on the S3 bucket
            var bucketPolicyStatement = new PolicyStatement(new PolicyStatementProps
            {
                Actions = new[] { "s3:GetObject" },
                Resources = new[] { bucket.BucketArn + "/*" },
                Effect = Effect.ALLOW,
                Principals = new[] { new CanonicalUserPrincipal(oai.CloudFrontOriginAccessIdentityS3CanonicalUserId) }
            });

            bucket.AddToResourcePolicy(bucketPolicyStatement);

            // Create CloudFront distribution
            var distribution = new CloudFrontWebDistribution(this, $"{BucketId}-distribution", new CloudFrontWebDistributionProps
            {
                OriginConfigs = new[]
                {
                    new SourceConfiguration
                    {
                        S3OriginSource = new S3OriginConfig
                        {
                            S3BucketSource = bucket,
                            OriginAccessIdentity = new OriginAccessIdentity(this, $"{BucketId}-oai")
                        },
                        Behaviors = new[] { new Behavior { IsDefaultBehavior = true } }
                    }
                }
            });

            // Deploy files to the S3 bucket
            new BucketDeployment(this, $"{BucketId}-deployment", new BucketDeploymentProps
            {
                Sources = new[] { Source.Asset("../dist") },
                DestinationBucket = bucket,
                Distribution = distribution,
                DistributionPaths = new[] { "/*" }
            });

            // Export CloudFront distribution ID
            new CfnOutput(this, "DistributionURL", new CfnOutputProps
            {
                Value = distribution.DistributionDomainName,
                Description = "CloudFront distribution"
            });

            // Output S3 bucket URL
            new CfnOutput(this, "BucketURL", new CfnOutputProps
            {
                Value = bucket.BucketWebsiteUrl,
                Description = "The URL of the S3 bucket website endpoint"
            });
        }
    }
}


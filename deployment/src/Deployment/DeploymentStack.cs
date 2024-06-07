using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront;
using Amazon.CDK.AWS.S3;
using Amazon.CDK.AWS.S3.Deployment;
using Constructs;

namespace Deployment;

public class DeploymentStack : Stack
{
    internal DeploymentStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
    {
        var s3Bucket = new Bucket(this, "aws-shop-react", new BucketProps
        {
            RemovalPolicy = RemovalPolicy.DESTROY,
            BlockPublicAccess = BlockPublicAccess.BLOCK_ALL,
            AutoDeleteObjects = true,
        });

        var oai = new OriginAccessIdentity(this, "aws-shop-react-oai", new OriginAccessIdentityProps());

        var distribution = new CloudFrontWebDistribution(this, "aws-shop-react-distribution",
            new CloudFrontWebDistributionProps
            {
                DefaultRootObject = "index.html",
                OriginConfigs = new ISourceConfiguration[]
                {
                    new SourceConfiguration
                    {
                        S3OriginSource = new S3OriginConfig
                        {
                            S3BucketSource = s3Bucket,
                            OriginAccessIdentity = oai,
                        },
                        Behaviors = new IBehavior[]
                        {
                            new Behavior
                            {
                                IsDefaultBehavior = true,
                            },
                        },
                    }
                }
            });

        // s3Bucket.AddToResourcePolicy(new PolicyStatement(new PolicyStatementProps
        // {
        //     Actions = new[] { "s3:GetObject" },
        //     Resources = new[] { s3Bucket.ArnForObjects("*") },
        //     Principals = new[] { oai.GrantPrincipal },
        //     Conditions = new Dictionary<string, object>
        //     {
        //         {
        //             "StringEquals", new Dictionary<string, object>
        //             {
        //                 { "AWS:SourceArn", $"arn:aws:cloudfront::{account}:distribution/{distribution.DistributionId}" }
        //             }
        //         }
        //     },
        // }));

        s3Bucket.GrantRead(oai);

        _ = new BucketDeployment(this, "aws-shop-react-deployment", new BucketDeploymentProps
        {
            Sources = new[] { Source.Asset("../dist") },
            DestinationBucket = s3Bucket,
            Distribution = distribution,
            DistributionPaths = new[] { "/*" },
        });
    }
}

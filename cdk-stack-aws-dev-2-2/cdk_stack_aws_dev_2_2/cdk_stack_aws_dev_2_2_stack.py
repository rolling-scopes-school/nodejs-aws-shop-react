import warnings
warnings.filterwarnings('ignore', module='aws_cdk')

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3_deployment as s3deploy,
    RemovalPolicy,
    CfnOutput,
    Tags
)
from constructs import Construct

class CdkStackAwsDev22Stack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        bucket_name = "aws-dev-2-2-shymanouski"
        tags = {
            "task": "2.2",
            "owner": "ashymanouski"
        }

        def apply_tags(resource):
            for key, value in tags.items():
                Tags.of(resource).add(key, value)

        website_bucket = s3.Bucket(
            self, "WebsiteBucket",
            bucket_name=bucket_name,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            enforce_ssl=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            bucket_key_enabled=True
        )
        apply_tags(website_bucket)

        origin_access_identity = cloudfront.OriginAccessIdentity(
            self, "WebsiteOAI",
            comment="OAI for website bucket"
        )
        apply_tags(origin_access_identity)

        distribution = cloudfront.Distribution(
            self, "WebsiteDistribution",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(
                    website_bucket,
                    origin_access_identity=origin_access_identity
                ),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
            ),
            default_root_object="index.html",
            comment="aws-dev-2-2: automated deployment"
        )
        apply_tags(distribution)

        deployment = s3deploy.BucketDeployment(
            self, "WebsiteDeployment",
            sources=[s3deploy.Source.asset("../dist")],
            destination_bucket=website_bucket,
            distribution=distribution,
            distribution_paths=["/*"]
        )
        apply_tags(deployment)

        apply_tags(self)

        CfnOutput(
            self, "CloudFrontURL",
            value=f"https://{distribution.distribution_domain_name}",
            description="CloudFront Distribution URL"
        )

        CfnOutput(
            self, "BucketName",
            value=website_bucket.bucket_regional_domain_name,
            description="S3 Bucket URL"
        )

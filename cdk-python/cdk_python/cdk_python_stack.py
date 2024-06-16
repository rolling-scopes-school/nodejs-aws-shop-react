from aws_cdk import (
    Stack,
    RemovalPolicy,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_iam as iam,
)
from constructs import Construct

class CdkPythonStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create an S3 bucket to host the static website, and public access blocked
        website_bucket = s3.Bucket(self, "tea-jar-store-bucket",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True  # Automatically delete objects when the bucket is deleted
        )

        # Create an Origin Access Identity (OAI) for CloudFront
        origin_access_identity = cloudfront.OriginAccessIdentity(self, "OAI")

        # Grant read permissions to CloudFront OAI on the S3 bucket
        website_bucket.grant_read(origin_access_identity)


        # Create a CloudFront distribution for the S3 bucket
        distribution = cloudfront.Distribution(self, "WebsiteDistribution",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(website_bucket, origin_access_identity=origin_access_identity),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            ),
            default_root_object="index.html",
        )

        # Add a bucket policy to allow access only from the CloudFront OAI
        website_bucket.add_to_resource_policy(iam.PolicyStatement(
            actions=["s3:GetObject"],
            resources=[website_bucket.arn_for_objects("*")],
            principals=[iam.CanonicalUserPrincipal(origin_access_identity.cloud_front_origin_access_identity_s3_canonical_user_id)],
            conditions={"StringEquals": {"AWS:SourceArn": f"arn:aws:cloudfront::{self.account}:distribution/{distribution.distribution_id}"}}
        ))

        # Deploy website contents to the S3 bucket
        s3_deployment.BucketDeployment(self, "DeployWithInvalidate",
            sources=[s3_deployment.Source.asset("../dist")],
            destination_bucket=website_bucket,
            distribution=distribution,  # Specify the CloudFront distribution
            distribution_paths=["/*"]  # Invalidate all paths in the distribution
        )
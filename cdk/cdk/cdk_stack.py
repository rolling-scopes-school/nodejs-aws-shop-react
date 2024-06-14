from constructs import Construct
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    RemovalPolicy,
    aws_iam as iam,
)


class CdkStack(Stack):

    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        s3_bucket = s3.Bucket(self, "rs-school-bucket-task_2",
                              removal_policy=RemovalPolicy.DESTROY,
                              auto_delete_objects=True,
                              block_public_access=s3.BlockPublicAccess.BLOCK_ALL
                              )

        origin_access_identity = cloudfront.OriginAccessIdentity(self, "OAITask2",
                                                                 comment='OAI for the distribution task 2')

        distribution = cloudfront.Distribution(self, "MyStaticSiteDistribution",
                                               default_behavior=cloudfront.BehaviorOptions(
                                                   origin=origins.S3Origin(s3_bucket,
                                                                           origin_access_identity=origin_access_identity),
                                                   viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
                                               ),
                                               default_root_object="index.html")

        s3_bucket.add_to_resource_policy(iam.PolicyStatement(
            actions=["s3:GetObject"],
            resources=[s3_bucket.arn_for_objects("*")],
            principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
            conditions={
                "StringEquals": {
                    "AWS:SourceArn": f"arn:aws:cloudfront::{self.account}:distribution/{distribution.distribution_id}"
                }
            }
        ))

        s3_bucket.grant_read(origin_access_identity)

        s3_deployment.BucketDeployment(self, "DeployWithInvalidation",
                                       sources=[s3_deployment.Source.asset("../dist")],
                                       destination_bucket=s3_bucket,
                                       distribution=distribution,
                                       distribution_paths=["/*"]
                                       )

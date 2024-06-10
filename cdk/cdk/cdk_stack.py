from constructs import Construct
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
    RemovalPolicy,
    aws_iam as iam,
)


class CdkStack(Stack):

    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        s3_bucket = s3.Bucket(self, "MyBucketNew",
                              removal_policy=RemovalPolicy.DESTROY,
                              auto_delete_objects=True,
                              block_public_access=s3.BlockPublicAccess.BLOCK_ACLS
                              )

        s3_bucket.add_to_resource_policy(iam.PolicyStatement(
            actions=["s3:GetObject"],
            resources=[s3_bucket.arn_for_objects("*")],
            principals=[iam.AnyPrincipal()],
            effect=iam.Effect.ALLOW,
            sid="PublicRead"
        ))

        s3_deployment.BucketDeployment(self, "DeployWithInvalidation",
                                       sources=[s3_deployment.Source.asset("../dist")],
                                       destination_bucket=s3_bucket,
                                       )

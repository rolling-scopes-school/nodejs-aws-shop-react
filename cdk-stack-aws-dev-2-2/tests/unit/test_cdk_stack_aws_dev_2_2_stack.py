import aws_cdk as core
import aws_cdk.assertions as assertions

from cdk_stack_aws_dev_2_2.cdk_stack_aws_dev_2_2_stack import CdkStackAwsDev22Stack

# example tests. To run these tests, uncomment this file along with the example
# resource in cdk_stack_aws_dev_2_2/cdk_stack_aws_dev_2_2_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = CdkStackAwsDev22Stack(app, "cdk-stack-aws-dev-2-2")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })

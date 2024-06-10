#!/usr/bin/env python3
import os

import aws_cdk as cdk
from cdk.cdk_stack import CdkStack

app = cdk.App()

aws_profile = app.node.try_get_context("aws_profile")
if aws_profile:
    os.environ["AWS_PROFILE"] = aws_profile

CdkStack(app, "CdkStack")

app.synth()

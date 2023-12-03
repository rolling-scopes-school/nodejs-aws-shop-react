#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const app = new cdk.App();
new CdkStack(app, "StackFE", {
  env: { account: "946060570212", region: "us-east-1" },
});

app.synth();

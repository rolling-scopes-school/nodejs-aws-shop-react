#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FeCdkStack } from "../lib/fe-cdk-stack";

const app = new cdk.App();
new FeCdkStack(app, "FeCdkStack");
app.synth();

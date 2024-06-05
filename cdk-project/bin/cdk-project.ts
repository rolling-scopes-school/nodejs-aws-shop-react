#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AWSWebAppStack } from "../lib/aws-web-app-stack";

const env = { region: "eu-central-1" };

const app = new cdk.App();

new AWSWebAppStack(app, "AWSWebAppStack", { env });

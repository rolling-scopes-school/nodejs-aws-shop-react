#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const STACK_ID = "RssShopSpaStack";

const app = new cdk.App();
export const stack = new CdkStack(app, STACK_ID, {
  env: { account: "851725613824", region: "eu-central-1" },
});

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { StaticSite } from "../lib/static-client-stack";

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, "StaticSite");
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, "MyStaticSite", {
  env: {
    account: app.node.tryGetContext("accountId"),
    region: "us-east-1",
  },
});

app.synth();

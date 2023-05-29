#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSite } from "./static-site";
import { App, StackProps } from "aws-cdk-lib";

const app = new cdk.App();

class MyStaticSiteStack extends cdk.Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    new StaticSite(this, "StaticWebsite");
  }
}

new MyStaticSiteStack(app, "MyStaticWebsite", {
});

console.info("Begin Synth command:");
app.synth();

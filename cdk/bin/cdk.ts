#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import { App } from "aws-cdk-lib"
import { StaticSite } from "../lib/static-site";

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, "JSCCStaticWebsite");
  }
} 

const app = new App();

new MyStaticSiteStack(app, "JSCCStaticWebsite");

app.synth();
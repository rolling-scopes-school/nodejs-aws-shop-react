#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSite } from "./static-site";
import { App, StackProps, DefaultStackSynthesizer } from "aws-cdk-lib";
import { Construct } from "constructs";

const app = new cdk.App();

class MyStaticSiteStack extends cdk.Stack {
  /*
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new StaticSite(this, "StaticWebsite");
  }
  */
  /*
  constructor(parent: cdk.App, name: string) {
    super(parent, name);
    new StaticSite(this, "StaticWebsite");
  }
  */
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    new StaticSite(this, "StaticWebsite");
  }
}

new MyStaticSiteStack(app, "MyStaticWebsite", {
  // stack properties
  /*
  synthesizer: new DefaultStackSynthesizer({
    qualifier: "react-shop",
    // fileAssetsBucketName: "foo", // more likely e.g. 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}'
    //bucketPrefix: "",
  }),
  */
});

console.info("Begin Synth command:");
app.synth();

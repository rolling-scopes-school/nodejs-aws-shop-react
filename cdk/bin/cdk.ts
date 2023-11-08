#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import { Stack, App } from "aws-cdk-lib"
import { StaticWebsite } from "../lib/cdk-stack"

class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string) {
    super(parent, name)

    new StaticWebsite(this, "JSCCStaticWebsite")
  }
}

const app = new cdk.App()
new MyStaticSiteStack(app, "MyJSCCStaticWebsite")

app.synth()

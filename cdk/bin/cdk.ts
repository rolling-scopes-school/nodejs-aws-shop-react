#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/cdk-stack';

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new CdkStack(this, 'JSCCStaticWebsite');
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, 'MyJSCCStaticWebsite');

app.synth();
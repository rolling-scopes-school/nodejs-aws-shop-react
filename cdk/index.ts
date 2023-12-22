#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { StaticSite } from './static-site';

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new StaticSite(this, 'StaticWebsite');
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, 'MyStaticWebsite');

app.synth();
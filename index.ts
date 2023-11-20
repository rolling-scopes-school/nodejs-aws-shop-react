import * as cdk from '@aws-cdk/core';
import { StaticSite } from './static-site';

class MyStatisticStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new StaticSite(this, 'first-app-aws');
  }
}

const app = new cdk.App();
new MyStatisticStack(app, 'first-app-aws');
app.synth();

// input in terminal: tsc
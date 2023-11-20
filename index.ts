import * as cdk from '@aws-cdk/core';

class MyStatisticStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);
  }
}

const app = new cdk.App();
new MyStatisticStack(app, 'first-app-aws');
app.synth();

// input in terminal: tsc
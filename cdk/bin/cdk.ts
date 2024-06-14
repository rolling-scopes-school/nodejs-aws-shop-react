import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSite } from '../lib/static-site';

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new StaticSite(this, 'CDKStaticWebsite');
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, 'MyStaticWebsite');

app.synth();
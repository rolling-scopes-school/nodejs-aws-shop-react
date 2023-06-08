import * as cdk from 'aws-cdk-lib';
import { EShopAppStack } from '../lib/cdk-stack';

const app = new cdk.App();
new EShopAppStack(app, 'EShopAppStack');
app.synth();

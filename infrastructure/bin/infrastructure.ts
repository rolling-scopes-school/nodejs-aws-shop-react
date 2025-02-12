#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION
    }
});

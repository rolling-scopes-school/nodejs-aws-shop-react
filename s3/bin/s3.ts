#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new S3Stack(app, 'S3Stack', {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION
    }
});
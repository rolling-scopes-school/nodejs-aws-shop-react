#!/bin/bash

# Exit on error
set -e

# Build the React application
echo "Building React application..."
npm run build

# Deploy using CDK
echo "Deploying to AWS..."
cd infrastructure
cdk deploy --outputs-file ./cdk-outputs.json

# Get the distribution ID from CDK outputs
DISTRIBUTION_ID=$(cat cdk-outputs.json | jq -r '.MyReactWebsiteStack.DistributionId')

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"

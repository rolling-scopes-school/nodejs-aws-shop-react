# Task 2 RsSchool

## Link of cloudfront:

d1jx7ph9nu9ejf.cloudfront.net

## Link of S3 bucket (access denied):

http://websitestack-websitebucket75c24d94-8tvqxavcjtlu.s3-website-eu-west-1.amazonaws.com

## Configuration:

Currently CDK dir is inside app project.
Need to feel variable DIST_DIR_LOCATION in cdk/lib/cdk-stack.ts with path of dist directory (relative to the cdk root directory)

To deploy app run command :
npm run deploy
It will create dist folder of web app and deploy it with using CDK.

import 'dotenv/config';
import { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import { 
  CloudFrontClient, 
  CreateDistributionCommand, 
  CreateOriginAccessControlCommand,
  ListOriginAccessControlsCommand 
} from "@aws-sdk/client-cloudfront";import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { fromSSO } from "@aws-sdk/credential-provider-sso";

const requiredEnvVars = [
  'S3_BUCKET_NAME',
  'AWS_PROFILE'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is required`);
    process.exit(1);
  }
}

const config = {
  region: 'eu-north-1',
  credentials: fromSSO({ profile: process.env.AWS_PROFILE })
};

const s3Client = new S3Client(config);
const cloudfrontClient = new CloudFrontClient(config);
const stsClient = new STSClient(config);

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function createAndConfigureBucket() {
  try {
    try {
      await s3Client.send(new CreateBucketCommand({
        Bucket: BUCKET_NAME,
        ACL: 'private'
      }));
      console.log('Bucket created successfully');
    } catch (err) {
      if (err.name === 'BucketAlreadyOwnedByYou') {
        console.log('Bucket already exists, continuing with configuration...');
      } else {
        throw err;
      }
    }

    await s3Client.send(new PutBucketWebsiteCommand({
      Bucket: BUCKET_NAME,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html'
        },
        ErrorDocument: {
          Key: 'index.html'
        }
      }
    }));
    console.log('Static website hosting enabled');

    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'AllowCloudFrontServicePrincipal',
          Effect: 'Allow',
          Principal: {
            Service: 'cloudfront.amazonaws.com'
          },
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
        }
      ]
    };

    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    }));
    console.log('Bucket policy updated');

    return true;
  } catch (err) {
    console.error('Error setting up bucket:', err);
    throw err;
  }
}

async function createCloudFrontDistribution() {
  try {
    let oacId;
    const oacName = `OAC-${BUCKET_NAME}`;
    
    try {
      const oacParams = {
        OriginAccessControlConfig: {
          Name: oacName,
          Description: `OAC for ${BUCKET_NAME}`,
          SigningProtocol: 'sigv4',
          SigningBehavior: 'always',
          OriginAccessControlOriginType: 's3'
        }
      };

      const oac = await cloudfrontClient.send(new CreateOriginAccessControlCommand(oacParams));
      oacId = oac.OriginAccessControl.Id;
      console.log('Origin Access Control created');
    } catch (err) {
      if (err.name === 'OriginAccessControlAlreadyExists') {
        const listOACCommand = new ListOriginAccessControlsCommand({});
        const existingOACs = await cloudfrontClient.send(listOACCommand);
        const existingOAC = existingOACs.OriginAccessControlList.Items.find(
          oac => oac.Name === oacName
        );
        
        if (existingOAC) {
          oacId = existingOAC.Id;
          console.log('Using existing Origin Access Control');
        } else {
          throw new Error('Could not find existing OAC');
        }
      } else {
        throw err;
      }
    }

    const params = {
      DistributionConfig: {
        CallerReference: Date.now().toString(),
        Comment: 'Distribution for React App',
        DefaultRootObject: 'index.html',
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: 'S3Origin',
              DomainName: `${BUCKET_NAME}.s3.${config.region}.amazonaws.com`,
              OriginAccessControlId: oacId,
              S3OriginConfig: {
                OriginAccessIdentity: ''
              }
            }
          ]
        },
        DefaultCacheBehavior: {
          TargetOriginId: 'S3Origin',
          ViewerProtocolPolicy: 'redirect-to-https',
          AllowedMethods: {
            Quantity: 2,
            Items: ['GET', 'HEAD'],
            CachedMethods: {
              Quantity: 2,
              Items: ['GET', 'HEAD']
            }
          },
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf',
          ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
          Compress: true
        },
        Enabled: true,
        CustomErrorResponses: {
          Quantity: 1,
          Items: [
            {
              ErrorCode: 403,
              ResponsePagePath: '/index.html',
              ResponseCode: '200',
              ErrorCachingMinTTL: 10
            }
          ]
        },
        PriceClass: 'PriceClass_100',
        ViewerCertificate: {
          CloudFrontDefaultCertificate: true
        },
        HttpVersion: 'http2'
      }
    };

    const distribution = await cloudfrontClient.send(new CreateDistributionCommand(params));
    console.log('CloudFront distribution created');
    return distribution.Distribution.Id;
  } catch (err) {
    console.error('Error creating CloudFront distribution:', err);
    throw err;
  }
}

async function setup() {
  try {
    try {
      await stsClient.send(new GetCallerIdentityCommand({}));
    } catch (error) {
      console.error('AWS SSO session is not active. Please run "aws sso login --profile dev_tom" first');
      process.exit(1);
    }

    console.log('Starting setup...');
    await createAndConfigureBucket();
    const distributionId = await createCloudFrontDistribution();
    console.log('Setup completed successfully!');
    console.log('CloudFront Distribution ID:', distributionId);
    console.log('Please wait 15-20 minutes for the CloudFront distribution to deploy');
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

setup();

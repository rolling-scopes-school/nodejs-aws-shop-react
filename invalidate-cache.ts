const { execSync } = require('child_process');
const stackName = 'AwsSdkStack';
const outputKey = 'DistributionId';

const distributionId = execSync(`aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='${outputKey}'].OutputValue" --output text`).toString().trim();

execSync(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths '/*'`, { stdio: 'inherit' });

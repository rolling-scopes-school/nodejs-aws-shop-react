import * as dotenv from "dotenv";

dotenv.config();

export default {
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};

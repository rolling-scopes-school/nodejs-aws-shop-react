public class Configuration {
    AWSCredentials credentials = new BasicAWSCredentials(
            "<AWS accesskey>",
            "<AWS secretkey>"
    );
    AmazonS3 s3client = AmazonS3ClientBuilder
            .standard()
            .withCredentials(new AWSStaticCredentialsProvider(credentials))
            .withRegion(Regions.US_EAST_2)
            .build();

}

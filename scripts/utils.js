import AWS from 'aws-sdk';

export async function abortMultipartUploads(
    s3: AWS.S3,
    bucketName: string
): Promise<void> {
    try {
        console.log('Checking for in-progress multipart uploads...');
        
        const uploads = await s3.listMultipartUploads({
            Bucket: bucketName
        }).promise();

        if (!uploads.Uploads || uploads.Uploads.length === 0) {
            console.log('No in-progress multipart uploads found.');
            return;
        }

        console.log(`Found ${uploads.Uploads.length} in-progress uploads. Aborting...`);

        await Promise.all(uploads.Uploads.map(upload => {
            if (!upload.UploadId || !upload.Key) return Promise.resolve();
            
            return s3.abortMultipartUpload({
                Bucket: bucketName,
                Key: upload.Key,
                UploadId: upload.UploadId
            }).promise();
        }));

        console.log('Successfully aborted all in-progress uploads.');
    } catch (error) {
        console.error('Error aborting multipart uploads:', error);
        throw error;
    }
}

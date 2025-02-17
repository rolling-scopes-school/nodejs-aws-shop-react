## ✅ Overview  

The MyShop! application was successfully deployed using **both manual and automated approaches**.  

### **Manual Deployment**  
- Configured an **S3 bucket** to host the application.  
- Uploaded the application **manually** and verified accessibility.  
- Set up a **CloudFront distribution** for optimized delivery.  
- Ensured S3 access is **restricted** (S3 URL returns **403 Access Denied**).  

### **Automated Deployment (AWS CDK)**  
- Used **AWS CDK** to automate **S3 bucket creation** and deployment.  
- Configured **CloudFront distribution** with correct access policies.  
- Implemented **automatic cache invalidation** upon redeployment.  
- Verified the **entire process works with a single command**:  


### **Deployment Links**
### *Manual Deployment*
CloudFront URL: https://d19l5ae2bxvzly.cloudfront.net
S3 Bucket URL: https://my-aws-s3-shop-bucket.s3.eu-central-1.amazonaws.com/index.html (Expected 403 Access Denied)
### *Automated Deployment (AWS CDK)*
CloudFront URL: https://d1j6kr2mg60m2q.cloudfront.net
S3 Bucket URL: http://shopwebappstack-myshopbucket3363d19f-eibyc6ggbm0w.s3-website.eu-central-1.amazonaws.com/ (Expected 403 Access Denied)
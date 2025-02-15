# Task 2: Serve SPA in AWS S3 & CloudFront

### 1. Link to Task

[https://github.com/natenadze1102/nodejs-aws-shop-react](https://github.com/natenadze1102/nodejs-aws-shop-react)

---

### 2. Screenshot

![React Shop App Screenshot](https://github.com/user-attachments/assets/11c3a0c5-bd28-4ea7-86dc-46a32a14806b)

_(If the above link is just an example, swap in your actual screenshot URL or drag-and-drop the image in your PR.)_

---

### 3. Deploy / Demo Links

- **CloudFront URL**:  
  [https://d2asobwjmky3a3.cloudfront.net/cart](https://d2asobwjmky3a3.cloudfront.net/cart)  
  _(Opens the React Shop application. You can test routes like `/`, `/cart`, etc.)_

- **S3 Bucket URL**:  
  [http://sdkinfrastackv2-task2bucket780f9f95-f04qecawvcwi.s3-website.eu-central-1.amazonaws.com/](http://sdkinfrastackv2-task2bucket780f9f95-f04qecawvcwi.s3-website.eu-central-1.amazonaws.com/)  
  _(Should return 403 if the bucket is private, but currently shows the website if set to public. Either way, main access is via CloudFront.)_

---

### 4. Date of Completion / Deadline

- **Done**: 2025-02-15 21:30
- **Deadline**: 2025-02-15 23:00

---

### 5. Self-Check with Preliminary Score

#### **Manual Deployment**

- **+30 points** – S3 bucket was manually created & configured. The app was uploaded, accessible.
- **+40 points** – CloudFront distribution configured; site is served via CloudFront URL; S3 bucket returns 403.
  - **Subtotal**: 70 points

#### **Automated Deployment**

- **+30 points** –

  - Added **CDK** scripts (`npm run deploy` & `npm run destroy`).
  - The **S3 Bucket** & **CloudFront** distribution are created automatically.
  - On deploy, the site is automatically uploaded & invalidation is created.

  - **Subtotal**: 30 points

**Total**: **70 + 30 = 100 points** (all requirements done)

---

### 6. What Has Been Done?

- [x] **Manual** S3 bucket creation & upload → verified `index.html` + minor UI changes
- [x] **Manual** CloudFront distribution creation → confirmed **403** from S3 and **200 OK** from CF
- [x] **CDK** setup:
  1. Created a `sdk-infra` folder via `cdk init --language typescript`
  2. **Bucket** + **CloudFront Distribution** with OAI
  3. **BucketDeployment** auto-uploads `dist/` on `npm run deploy`
  4. Auto **CloudFront invalidation**
- [x] **`cdk destroy`** tested to ensure cleanup.

_(No extraneous files, node_modules, or commented code are included.)_

---

### 7. Quick Start (Optional)

```bash
# Build your React Shop
npm install
npm run build

# Deploy via AWS CDK
npm run deploy

# Destroy resources when done
npm run destroy
```

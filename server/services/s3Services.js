const AWS = require("aws-sdk");
exports.uploadToS3 = (data, filename) => {
  const BUCKET_NAME = "expensetrackingapp123";
  const UserKey = process.env.IAM_USER_KEY;
  const UserSecret = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: UserKey,
    secretAccessKey: UserSecret,
    // Bucket: BUCKET_NAME
  });
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        // console.log("Something went wrong while uploading on Bucket", err);
        reject(err);
      } else {
        // console.log("Success", s3response.Location);
        resolve(s3response.Location);
      }
    });
  });
};
import express from 'express'; 
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from 'multer'; // For handling file uploads

// Initialize AWS SDK clients
const s3 = new S3Client({ region: "us-east-1" });
const sns = new SNSClient({ region: "us-east-1" });
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:980921728092:mytopic";
const DYNAMODB_TABLE_NAME = "test-db";
const BUCKET_NAME = "my-backend-project";

// Set up multer for handling multipart form data (file uploads)
const upload = multer();

// Express app setup
const app = express();
app.use(express.json()); // To parse JSON request bodies

// Handle the form data coming from the frontend
app.post('/signup', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profileImage = req.file; // Get the uploaded file

    if (!profileImage) {
      return res.status(400).json({ error: 'Profile image is required' });
    }

    // Log data to check if we are receiving the correct form fields
    console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
    console.log(`Profile Image: ${profileImage.originalname}`);

    // Generate pre-signed URL for S3 upload
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: profileImage.originalname, // Use the file's original name
      ContentType: profileImage.mimetype,
    };
    const command = new PutObjectCommand(uploadParams);
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

    // Save data to DynamoDB
    const timestamp = new Date().toISOString();
    const item = {
      email: { S: email },
      imageUrl: { S: `https://${BUCKET_NAME}.s3.amazonaws.com/${profileImage.originalname}` },
      datetime: { S: timestamp },
    };

    await dynamoDB.send(new PutItemCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Item: item,
    }));

    // Send SNS notification
    const snsMessage = `A new file named ${profileImage.originalname} was uploaded by ${email}.`;
    await sns.send(new PublishCommand({
      Message: snsMessage,
      TopicArn: SNS_TOPIC_ARN,
    }));

    // Return the pre-signed URL to the front end
    res.status(200).json({ uploadURL });

  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// Start Express.js server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

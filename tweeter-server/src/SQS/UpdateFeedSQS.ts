import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(senderName: string, post: string, followers: string[], timeStamp: number): Promise<void> {
  const sqs_url = "https://sqs.us-east-2.amazonaws.com/533267054052/UpdateFeed";

  const message = {
    senderName: senderName,
    post:post,
    followers: followers,
    timeStamp: timeStamp
  };

  const params = {
    DelaySeconds: 10,
    MessageBody: JSON.stringify(message),
    QueueUrl: sqs_url,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
  } catch (err) {
    throw err;
  }
}

export default sendMessage;

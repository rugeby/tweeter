
import { FollowDao } from "../DAO/FollowDao";
import sendMessage from "../SQS/UpdateFeedSQS";


export const handler = async function (event: any) {
    let followDao = new FollowDao()
    let timestamp = Date.now();
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        let request = JSON.parse(body);
        let followers = await followDao.getJustFollowersAlias(request.senderName);
        let batch = [];
        for(let i = 0; i < followers.length; i++){
            batch.push(followers[i]);
            if (batch.length == 25) {
                await sendMessage(request.senderName,request.post,batch,timestamp);
                batch = [];
            }

        }
        if (batch.length > 0) {
            await sendMessage(request.senderName, request.post,batch,timestamp);
            batch = [];
        }

    }
  };
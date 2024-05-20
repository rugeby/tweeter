import { FeedDao } from "../DAO/FeedDao";


export const handler = async function (event: any) {    
    let feedDAO = new FeedDao();

    for (let i = 0; i < event.Records.length; ++i) {
		const { body } = event.Records[i];
		let request = JSON.parse(body);
    
        let followers = request.followers;
        
        for(let i = 0; i < followers.length; i++){
            await feedDAO.putFeed(followers[i], request.timeStamp, request.post, request.senderName);
     
        }

    }


  };
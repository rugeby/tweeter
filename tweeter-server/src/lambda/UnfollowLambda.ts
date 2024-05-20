import { UnfollowRequest, UnfollowResponse} from "tweeter-shared"; 
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:UnfollowRequest):Promise<UnfollowResponse>=>{
      let request = UnfollowRequest.fromJson(event);

      return new FollowService(await new DynamoDBDaoFactory()).unfollow(request); 


    }



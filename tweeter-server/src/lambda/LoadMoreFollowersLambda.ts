import { LoadMoreCyberHumanRequest, LoadMoreFollowersResponse} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:LoadMoreCyberHumanRequest):Promise<LoadMoreFollowersResponse>=>{
        let request = LoadMoreCyberHumanRequest.fromJson(event)
        return new FollowService(await new DynamoDBDaoFactory()).loadMoreFollowers(request);


    }



import { LoadMoreCyberHumanRequest, LoadMoreFolloweesResponse} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:LoadMoreCyberHumanRequest):Promise<LoadMoreFolloweesResponse>=>{
        console.log(event.lastItem) // it's normal
        let request = LoadMoreCyberHumanRequest.fromJson(event)
        console.log(request.lastItem)// it is null
        return new FollowService(await new DynamoDBDaoFactory()).loadMoreFollowees(request);


    }



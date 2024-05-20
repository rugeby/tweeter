import { GetAuthTokenandUserRequest, GetFollowersCountResponse} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:GetAuthTokenandUserRequest):Promise<GetFollowersCountResponse>=>{
    let request = GetAuthTokenandUserRequest.fromJson(event)
    return new FollowService(await new DynamoDBDaoFactory()).getFollowersCount(request);
}



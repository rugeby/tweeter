import { GetAuthTokenandUserRequest, GetFolloweesCountResponse} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:GetAuthTokenandUserRequest):Promise<GetFolloweesCountResponse>=>{
    let request = GetAuthTokenandUserRequest.fromJson(event)
    return new FollowService(await new DynamoDBDaoFactory()).getFolloweesCount(request);
}



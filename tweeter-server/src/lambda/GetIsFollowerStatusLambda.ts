import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:GetIsFollowerStatusRequest):Promise<GetIsFollowerStatusResponse>=>{
    let request = GetIsFollowerStatusRequest.fromJson(event)
    return new FollowService(await new DynamoDBDaoFactory()).getIsFollowerStatus(request);
}



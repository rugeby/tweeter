import {GetUserRequest, GetUserResponse} from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:GetUserRequest):Promise<GetUserResponse>=>{
    let request = GetUserRequest.fromJson(event)
    return new UserService(await new DynamoDBDaoFactory()).getUser(request);
}

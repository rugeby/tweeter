import {FollowRequest, FollowResponse} from "tweeter-shared"; 
import { FollowService } from "../model/service/FollowService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:FollowRequest):Promise<FollowResponse>=>{
  let request = FollowRequest.fromJson(event);
  return new FollowService(await new DynamoDBDaoFactory()).follow(request); 
}



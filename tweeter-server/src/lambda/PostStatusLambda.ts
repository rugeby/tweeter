import {PostStatusRequest} from "tweeter-shared"; 
import { StatusService } from "../model/service/StatusService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:PostStatusRequest):Promise<void>=>{
      let request = PostStatusRequest.fromJson(event);

      await new StatusService(await new DynamoDBDaoFactory()).postStatus(request); 


    }



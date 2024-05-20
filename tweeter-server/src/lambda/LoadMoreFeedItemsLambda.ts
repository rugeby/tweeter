import {LoadMoreFeedStoryResponse, loadMoreItemsRequest} from "tweeter-shared"; 
import { StatusService } from "../model/service/StatusService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:loadMoreItemsRequest):Promise<LoadMoreFeedStoryResponse>=>{
        let request = loadMoreItemsRequest.fromJson(event);
        return new StatusService(await new DynamoDBDaoFactory()).loadMoreFeedItems(request); 


    }



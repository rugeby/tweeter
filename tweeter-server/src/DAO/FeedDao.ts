import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status} from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { StatusFeed } from "tweeter-shared/dist/model/domain/Status";
import { FeedProvider } from "../Interface/interfaceDao";
export class FeedDao implements FeedProvider{
  //Status && followerAlias
    readonly tableName = "feed";
    readonly receiverAlias = "receiverAlias"; //PK
    readonly timeStamp = "timeStamp"; //SK
    readonly lastItem ="lastItem";
    readonly post = "post";
    readonly posterAlias ="posterAlias";



    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async putFeed(receiverAlias:string, timeStamp:number, post:String, posterAlias:string):Promise<void>{
        const params = {
            TableName: this.tableName,
            Item: {
                [this.receiverAlias]:receiverAlias,
                [this.timeStamp]:timeStamp,
                [this.post]:post,
                [this.posterAlias]:posterAlias
    
            },
          };
          await this.client.send(new PutCommand(params));
        }

        async getFeed(userAlias:string, lastItem:Status, pageSize:number):Promise<DataPage<StatusFeed>> {
          const params = {
            KeyConditionExpression: this.receiverAlias + " = :s",
            ExpressionAttributeValues: {
              ":s": userAlias,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
              lastItem == undefined
                ? undefined
                : {
                    [this.receiverAlias]: userAlias,
                    [this.timeStamp]:lastItem.timestamp,
                  },
                  ScanIndexForward:false,
          };
                  const storys:StatusFeed[] = [];
                  const data = await this.client.send(new QueryCommand(params));
                  const hasMorePages = data.LastEvaluatedKey != undefined;
                  data.Items?.forEach((story)=>
                  storys.push(
                    new StatusFeed(
                      story.post,
                      story.posterAlias,
                      story.timeStamp
                      )
                  )

                  )
                  return new DataPage<StatusFeed>(storys, hasMorePages);
        
            }

    


}
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { StoryProvider } from "../Interface/interfaceDao";
export class StoryDao implements StoryProvider{
  //only contain Status
    readonly tableName = "story";
    readonly senderAlias = "senderAlias"; //PK author Alias
    readonly timeStamp = "timeStamp"; //SK
    readonly lastItem ="lastItem";
    readonly post = "post";


    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async putStory(status:Status):Promise<void>{
        const params = {
            TableName: this.tableName,
            Item: {
                [this.senderAlias]:status.user.alias,
                [this.timeStamp]:status.timestamp,
                [this.post]:status.post,

    
            },
          };
          await this.client.send(new PutCommand(params));
        }

        async getStory(userAlias:string, lastItem:Status, pageSize:number):Promise<DataPage<Status>> {
          const params = {
            KeyConditionExpression: this.senderAlias + " = :s",
            ExpressionAttributeValues: {
              ":s": userAlias,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
              lastItem == undefined
                ? undefined
                : {
                    [this.senderAlias]: userAlias,
                    [this.timeStamp]:lastItem.timestamp,
                  },
                  ScanIndexForward:false,
          };
                  const storys:Status[] = [];
                  const data = await this.client.send(new QueryCommand(params));
                  const hasMorePages = data.LastEvaluatedKey != undefined;
                  data.Items?.forEach((story)=>
                  storys.push(
                    new Status(
                      story[this.post],
                      new User("","",story[this.senderAlias],""),
                      story[this.timeStamp]
                    )
                  )
                  )
                  return new DataPage<Status>(storys, hasMorePages);
        
            }


            

    


}


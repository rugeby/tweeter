import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {  User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { FollowProvider } from "../Interface/interfaceDao";

export class FollowDao implements FollowProvider{
    readonly tableName = "follow";
    readonly followerAlias= "followerAlias"; //PK
    readonly foloweeAlias = "foloweeAlias"; //SK
    readonly indexName = "follow_inverse"; //index
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async putFollow(followerAlias:string, followeeAlias:string):Promise<void>{
        const params = {
            TableName: this.tableName,
            Item: {
              [this.followerAlias]: followerAlias,
              [this.foloweeAlias]:followeeAlias
            },
          };
          await this.client.send(new PutCommand(params));

    }


    async deleteFollow(followerAlias:string, followeeAlias:string):Promise<void>{
        const params = {
          TableName: this.tableName,
          Key: {
            [this.followerAlias]: followerAlias,
          [this.foloweeAlias]: followeeAlias,
          }
        };
        await this.client.send(new DeleteCommand(params));
  
  
      }
 

      async getFollowees(followerAlias:string,  lastUser:User, pageSize:number):Promise<DataPage<string>>{
        const params = {
          KeyConditionExpression: this.followerAlias + " = :s",
          ExpressionAttributeValues: {
            ":s": followerAlias,
          },
          TableName: this.tableName,
          Limit: pageSize,
          ExclusiveStartKey:
            lastUser == undefined
              ? undefined
              : {
                  [this.followerAlias]:followerAlias,
                  [this.foloweeAlias]:lastUser.alias,
                },
                ScanIndexForward:false,};

          const users:string[] = [];
          const data = await this.client.send(new QueryCommand(params));

          const hasMorePages = data.LastEvaluatedKey != undefined;
          data.Items?.forEach((row)=>
            users.push(
            row[this.foloweeAlias]
              )
            )
            return new DataPage<string>(users, hasMorePages);
     }
      
      async getFollowers(followeeAlias: string, lastUser: User, pageSize: number): Promise<DataPage<string>> {
        const params = {
          KeyConditionExpression: this.foloweeAlias + " = :s",
    
          ExpressionAttributeValues: {
            ":s": followeeAlias,
          },
            TableName: this.tableName,
            IndexName:this.indexName,
            
            Limit: pageSize,
            ExclusiveStartKey: lastUser ? {
                [this.followerAlias]: lastUser.alias,
                [this.foloweeAlias]: followeeAlias
            } : undefined,
            ScanIndexForward: false,
        };
    
        const followers: string[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey != undefined;
    
        data.Items?.forEach((row) => {
            followers.push(row[this.followerAlias]);
        });
    
        return new DataPage<string>(followers, hasMorePages);
    }


    async getJustFollowersAlias(userAlias:string):Promise<string[]>{
      const params = {
        KeyConditionExpression: this.foloweeAlias + " = :s",
  
        ExpressionAttributeValues: {
          ":s": userAlias,
        },
          TableName: this.tableName,
          IndexName:this.indexName,
          ScanIndexForward: false,
      };
  
      const followers: string[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
  
      data.Items?.forEach((row) => {
          followers.push(row[this.followerAlias]);
      });
  
      return followers;
    }

    async isFollower(userAlias:string, selectedUserAlias:string):Promise<boolean>{

const params = {
  KeyConditionExpression: this.followerAlias + " = :s",
  ExpressionAttributeValues: {
    ":s": userAlias,
  },
  TableName: this.tableName,
  ScanIndexForward:false,
};
        const users:string[] = [];
        let result:boolean = false;
        const data = await this.client.send(new QueryCommand(params));
        data.Items?.forEach((row)=>
        users.push(
          row[this.foloweeAlias]
          )
        )
        users.forEach(alias => {
          if(alias == selectedUserAlias){
            result = true;
          }
        });


      return result;
    }


    
    
      


}
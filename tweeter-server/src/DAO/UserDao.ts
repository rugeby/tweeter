import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { UserProvider } from "../Interface/interfaceDao";

export class UserDAO implements UserProvider{
    readonly tableName = "user";
    readonly userAlias = "alias"; //PK
    readonly firstName = "firstName";
    readonly lastName = "lastName";
    readonly imageUrl = "imageUrl";
    readonly password = "password";
    readonly followingCount = "followingCount";
    readonly followersCount = "followersCount";

    readonly region = "us-east-2";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({region:this.region}));

    async putUser(user:User, password:string):Promise<void>{
      let following_count = 0;
      let follower_count = 0;
        const params = {
            TableName: this.tableName,
            Item: {
              [this.userAlias]: user.alias,
              [this.firstName]:user.firstName,
              [this.lastName]:user.lastName,
              [this.imageUrl]:user.imageUrl,
              [this.password]:password,
              [this.followingCount]:following_count,
              [this.followersCount]:follower_count
            },
          };
          await this.client.send(new PutCommand(params));

        }


    async getUser(alias:String):Promise<User|undefined> {
        const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]:alias
                }
              };
              const output = await this.client.send(new GetCommand(params));
              return output.Item == undefined
                ? undefined
                : new User(
                    output.Item["firstName"],
                    output.Item["lastName"],
                    output.Item[this.userAlias],
                    output.Item["imageUrl"]
                  );
    
        }

        async getUserPassword(alias:string):Promise<string|undefined>{
          const params = {
            TableName: this.tableName,
            Key: {
                [this.userAlias]:alias
            }
          };
          const output = await this.client.send(new GetCommand(params));
          return output.Item == undefined
            ? undefined: output.Item["password"]
              
        }

        async getFollowersCount(alias:string):Promise<number>{

          const params = {
            TableName: this.tableName,
            Key:{
                [this.userAlias]: alias
            },
            ProjectionExpression: "followersCount"

        };

        const response = await this.client.send(new GetCommand(params));

        return response.Item == undefined ? undefined : response.Item["followersCount"];
               
        }

        async getFollowingsCount(alias:string):Promise<number>{
          const params = {
            TableName: this.tableName,
            Key:{
                [this.userAlias]: alias
            },
            ProjectionExpression: "followingCount"

        };

        const response = await this.client.send(new GetCommand(params));

        return response.Item == undefined ? undefined : response.Item["followingCount"];
        }

        async increaseFollowersCount(alias:string):Promise<void>{
            const params = {
              TableName: this.tableName,
              Key:{
                  [this.userAlias]: alias
              },
              UpdateExpression: "SET followersCount = followersCount + :val",
              ExpressionAttributeValues: {
                  ":val": 1
              }
              };

              await this.client.send(new UpdateCommand(params));
        }

        async decreaseFollowersCount(alias:string):Promise<void>{
          const params = {
            TableName: this.tableName,
            Key:{
                [this.userAlias]: alias
            },
            UpdateExpression: "SET followersCount = followersCount - :val",
            ExpressionAttributeValues: {
                ":val": 1
            }
            };

            await this.client.send(new UpdateCommand(params));
        }

        async increaseFollowingCount(alias:string):Promise<void>{
          const params = {
            TableName: this.tableName,
            Key:{
                [this.userAlias]: alias
            },
            UpdateExpression: "SET followingCount = followingCount + :val",
            ExpressionAttributeValues: {
                ":val": 1
            }
            };

            await this.client.send(new UpdateCommand(params));
        }
        async decreaseFollowingCount(alias:string):Promise<void>{
          const params = {
            TableName: this.tableName,
            Key:{
                [this.userAlias]: alias
            },
            UpdateExpression: "SET followingCount = followingCount - :val",
            ExpressionAttributeValues: {
                ":val": 1
            }
            };

            await this.client.send(new UpdateCommand(params));

        }

  




}


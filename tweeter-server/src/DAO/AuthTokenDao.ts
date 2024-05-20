
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
import { AuthTokenProvider } from "../Interface/interfaceDao";

export class AuthTokenDao implements AuthTokenProvider{
    readonly tableName = "authToken";
    readonly authtoken = "authtoken"; //SK
    readonly timeStamp = "timestamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


    async putAuthToken(authToken:AuthToken):Promise<void>{
        const params = {
            TableName: this.tableName,
            Item: {
              [this.authtoken]: authToken.token,
              [this.timeStamp]:authToken.timestamp
            },
          };
          await this.client.send(new PutCommand(params));

    }

    async getAuthToken(authToken:AuthToken):Promise<AuthToken|undefined> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.authtoken]: authToken.token,
                [this.timeStamp]: authToken.timestamp
         
            }
          };
          const output = await this.client.send(new GetCommand(params));
          return output.Item == undefined
            ? undefined
            : new AuthToken(
                output.Item[this.authtoken],
                output.Item[this.timeStamp],

              );

    }
    async isvalidateAuth(authToken:AuthToken):Promise<boolean>{
      let ts = authToken.timestamp;
      const currentTime = new Date();
      const tokenAge = (currentTime.getTime()- ts)/1000;
      if(tokenAge > 50000){
        return false;
      }
      else{
        return true;
      }
      
    }

    async deleteAuthToken(authToken: AuthToken): Promise<void> {
      const params = {
            TableName: this.tableName,
            Key: {
                [this.authtoken]: authToken.token,
            },
        };
        await this.client.send(new DeleteCommand(params));
    }

}
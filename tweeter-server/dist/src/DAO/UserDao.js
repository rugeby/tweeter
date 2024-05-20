"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class UserDAO {
    constructor() {
        this.tableName = "user";
        this.userAlias = "alias"; //PK
        this.firstName = "firstName";
        this.lastName = "lastName";
        this.imageUrl = "imageUrl";
        this.password = "password";
        this.region = "us-east-2";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: this.region }));
        // async getUserList(aliases: string[]): Promise<User[]> {
        //   let userList: User[] = [];
        //   let aliastListNoDuplicates = [...new Set(aliases)];
        //   // AWS returns the users in a different order, even if the original alias list is passed instead of the no duplicates list.
        //   let userUnorderedList = await this.getUsersFromDynamo(
        //     aliastListNoDuplicates
        //   );
        //   aliases.forEach((s) => {
        //     let user = userUnorderedList.find((u) => u.alias == s);
        //     if (user !== undefined) userList.push(user);
        //     else throw new Error("Status could not find user with username " + s);
        //   });
        //   return userList;
        // }
        // private async getUsersFromDynamo(aliases: string[]): Promise<User[]> {
        //   if (aliases.length == 0) return [];
        //   let keys = [];
        //   for (let i = 0; i < aliases.length; ++i) {
        //     keys.push(this.createGetUserRequest(aliases[i]));
        //   }
        //   let params = {
        //     RequestItems: {
        //       [TABLE_NAME]: {
        //         Keys: keys,
        //       },
        //     },
        //   };
        //   let command = new BatchGetItemCommand(params);
        //   let items: User[] = [];
        //   let data = await ddbDocClient.send(command);
        //   if (data.Responses != undefined) {
        //     data.Responses[TABLE_NAME].forEach((s) => {
        //       let alias = s[PRIMARY_KEY].S;
        //       let firstname = s[FIRST_NAME].S;
        //       let lastname = s[LAST_NAME].S;
        //       let imageUrl = s[IMAGE_URL].S;
        //       alias = alias === undefined ? "undefined" : alias;
        //       firstname = firstname === undefined ? "undefined" : firstname;
        //       lastname = lastname === undefined ? "undefined" : lastname;
        //       imageUrl = imageUrl === undefined ? "undefined" : imageUrl;
        //       items.push(new User(firstname, lastname, alias, imageUrl));
        //     });
        //   }
        //   return items;
        // }
    }
    putUser(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.userAlias]: user.alias,
                    [this.firstName]: user.firstName,
                    [this.lastName]: user.lastName,
                    [this.imageUrl]: user.imageUrl,
                    [this.password]: password
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
            console.log("Response from DynamoDB is: ");
        });
    }
    getUser(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                }
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? undefined
                : new tweeter_shared_1.User(output.Item["firstName"], output.Item["lastName"], output.Item[this.userAlias], output.Item["imageUrl"]);
        });
    }
    getUserPassword(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                }
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? undefined : output.Item["password"];
        });
    }
}
exports.UserDAO = UserDAO;

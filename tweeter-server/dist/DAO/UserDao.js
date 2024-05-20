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
        this.followingCount = "followingCount";
        this.followersCount = "followersCount";
        this.region = "us-east-2";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: this.region }));
    }
    putUser(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let following_count = 0;
            let follower_count = 0;
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.userAlias]: user.alias,
                    [this.firstName]: user.firstName,
                    [this.lastName]: user.lastName,
                    [this.imageUrl]: user.imageUrl,
                    [this.password]: password,
                    [this.followingCount]: following_count,
                    [this.followersCount]: follower_count
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
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
    getFollowersCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                },
                ProjectionExpression: "followersCount"
            };
            const response = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return response.Item == undefined ? undefined : response.Item["followersCount"];
        });
    }
    getFollowingsCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                },
                ProjectionExpression: "followingCount"
            };
            const response = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return response.Item == undefined ? undefined : response.Item["followingCount"];
        });
    }
    increaseFollowersCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                },
                UpdateExpression: "SET followersCount = followersCount + :val",
                ExpressionAttributeValues: {
                    ":val": 1
                }
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    decreaseFollowersCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                },
                UpdateExpression: "SET followersCount = followersCount - :val",
                ExpressionAttributeValues: {
                    ":val": 1
                }
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    increaseFollowingCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                },
                UpdateExpression: "SET followingCount = followingCount + :val",
                ExpressionAttributeValues: {
                    ":val": 1
                }
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    decreaseFollowingCount(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.userAlias]: alias
                },
                UpdateExpression: "SET followingCount = followingCount - :val",
                ExpressionAttributeValues: {
                    ":val": 1
                }
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
}
exports.UserDAO = UserDAO;

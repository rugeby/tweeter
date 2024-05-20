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
exports.FollowDao = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const DataPage_1 = require("../entity/DataPage");
class FollowDao {
    constructor() {
        this.tableName = "follow";
        this.followerAlias = "followerAlias"; //PK
        this.foloweeAlias = "foloweeAlias"; //SK
        this.indexName = "follow_inverse"; //index
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putFollow(followerAlias, followeeAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.followerAlias]: followerAlias,
                    [this.foloweeAlias]: followeeAlias
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    deleteFollow(followerAlias, followeeAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.followerAlias]: followerAlias,
                    [this.foloweeAlias]: followeeAlias,
                }
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    getFollowees(followerAlias, lastUser, pageSize) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followerAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": followerAlias,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ExclusiveStartKey: lastUser == undefined
                    ? undefined
                    : {
                        [this.followerAlias]: followerAlias,
                        [this.foloweeAlias]: lastUser.alias,
                    },
                ScanIndexForward: false,
            };
            const users = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey != undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((row) => users.push(row[this.foloweeAlias]));
            return new DataPage_1.DataPage(users, hasMorePages);
        });
    }
    getFollowers(followeeAlias, lastUser, pageSize) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.foloweeAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": followeeAlias,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
                Limit: pageSize,
                ExclusiveStartKey: lastUser ? {
                    [this.followerAlias]: lastUser.alias,
                    [this.foloweeAlias]: followeeAlias
                } : undefined,
                ScanIndexForward: false,
            };
            const followers = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey != undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((row) => {
                followers.push(row[this.followerAlias]);
            });
            return new DataPage_1.DataPage(followers, hasMorePages);
        });
    }
    getJustFollowersAlias(userAlias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.foloweeAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": userAlias,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
                ScanIndexForward: false,
            };
            const followers = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((row) => {
                followers.push(row[this.followerAlias]);
            });
            return followers;
        });
    }
    getFolloweesCount(followerAlias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followerAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": followerAlias,
                },
                TableName: this.tableName,
                ScanIndexForward: false,
            };
            const users = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((row) => users.push(row[this.foloweeAlias]));
            return users.length;
        });
    }
    getFollowersCount(followeeAlias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.foloweeAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": followeeAlias,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
                ScanIndexForward: false,
            };
            const followers = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((row) => {
                followers.push(row[this.followerAlias]);
            });
            return followers.length;
        });
    }
    isFollower(userAlias, selectedUserAlias) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //userAlias = followerAlias
            //selectedUser = followee
            const params = {
                KeyConditionExpression: this.followerAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": userAlias,
                },
                TableName: this.tableName,
                ScanIndexForward: false,
            };
            const users = [];
            let result = false;
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((row) => users.push(row[this.foloweeAlias]));
            users.forEach(alias => {
                if (alias == selectedUserAlias) {
                    result = true;
                }
            });
            return result;
        });
    }
}
exports.FollowDao = FollowDao;

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
exports.StoryDao = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
const DataPage_1 = require("../entity/DataPage");
class StoryDao {
    constructor() {
        //only contain Status
        this.tableName = "story";
        this.senderAlias = "senderAlias"; //PK author Alias
        this.timeStamp = "timeStamp"; //SK
        this.lastItem = "lastItem";
        this.post = "post";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putStory(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.senderAlias]: status.user.alias,
                    [this.timeStamp]: status.timestamp,
                    [this.post]: status.post,
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getStory(userAlias, lastItem, pageSize) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.senderAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": userAlias,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ExclusiveStartKey: lastItem == undefined
                    ? undefined
                    : {
                        [this.senderAlias]: userAlias,
                        [this.timeStamp]: lastItem.timestamp,
                    },
                ScanIndexForward: false,
            };
            const storys = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey != undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((story) => storys.push(new tweeter_shared_1.Status(story[this.post], new tweeter_shared_1.User("", "", story[this.senderAlias], ""), story[this.timeStamp])));
            return new DataPage_1.DataPage(storys, hasMorePages);
        });
    }
}
exports.StoryDao = StoryDao;

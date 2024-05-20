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
exports.FeedDao = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const DataPage_1 = require("../entity/DataPage");
const Status_1 = require("tweeter-shared/dist/model/domain/Status");
class FeedDao {
    constructor() {
        //Status && followerAlias
        this.tableName = "feed";
        this.receiverAlias = "receiverAlias"; //PK
        this.timeStamp = "timeStamp"; //SK
        this.lastItem = "lastItem";
        this.post = "post";
        this.posterAlias = "posterAlias";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putFeed(receiverAlias, timeStamp, post, posterAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.receiverAlias]: receiverAlias,
                    [this.timeStamp]: timeStamp,
                    [this.post]: post,
                    [this.posterAlias]: posterAlias
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getFeed(userAlias, lastItem, pageSize) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.receiverAlias + " = :s",
                ExpressionAttributeValues: {
                    ":s": userAlias,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ExclusiveStartKey: lastItem == undefined
                    ? undefined
                    : {
                        [this.receiverAlias]: userAlias,
                        [this.timeStamp]: lastItem.timestamp,
                    },
                ScanIndexForward: false,
            };
            const storys = [];
            const data = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey != undefined;
            (_a = data.Items) === null || _a === void 0 ? void 0 : _a.forEach((story) => storys.push(new Status_1.StatusFeed(story.post, story.posterAlias, story.timeStamp)));
            return new DataPage_1.DataPage(storys, hasMorePages);
        });
    }
}
exports.FeedDao = FeedDao;

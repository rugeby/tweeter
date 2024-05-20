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
exports.AuthTokenDao = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class AuthTokenDao {
    constructor() {
        this.tableName = "authToken";
        this.authtoken = "authtoken"; //SK
        this.timeStamp = "timestamp";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    }
    putAuthToken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.authtoken]: authToken.token,
                    [this.timeStamp]: authToken.timestamp
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getAuthToken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.authtoken]: authToken.token,
                    [this.timeStamp]: authToken.timestamp
                }
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? undefined
                : new tweeter_shared_1.AuthToken(output.Item[this.authtoken], output.Item[this.timeStamp]);
        });
    }
    isvalidateAuth(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let ts = authToken.timestamp;
            const currentTime = new Date();
            const tokenAge = (currentTime.getTime() - ts) / 1000;
            if (tokenAge > 50000) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    deleteAuthToken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.authtoken]: authToken.token,
                },
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
}
exports.AuthTokenDao = AuthTokenDao;

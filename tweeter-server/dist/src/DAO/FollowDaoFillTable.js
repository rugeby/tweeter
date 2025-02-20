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
exports.getServerVariable = exports.FollowDaoFillTable = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const child_process_1 = require("child_process");
const BatchService_1 = require("../model/service/BatchService");
// import { ddbDocClient } from "./ClientDynamo";
class FollowDaoFillTable {
    constructor() {
        this.TABLE_NAME = getServerVariable('follow');
        //FOLLOW_TABLE_NAME
        this.PRIMARY_KEY = getServerVariable('followerAlias');
        //FOLLOW_PRIMARY_KEY
        this.SORT_KEY = getServerVariable('foloweeAlias');
    }
    //FOLLOW_SORT_KEY
    createFollows(followeeAlias, followerAliasList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (followerAliasList.length == 0) {
                console.log('zero followers to batch write');
                return;
            }
            else {
                const params = {
                    RequestItems: {
                        [this.TABLE_NAME]: this.createPutFollowRequestItems(followeeAlias, followerAliasList)
                    }
                };
                yield BatchService_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params))
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    yield this.putUnprocessedItems(resp, params, 0);
                    return;
                }))
                    .catch(err => {
                    throw new Error('Error while batchwriting follows with params: ' + params + ": \n" + err);
                });
            }
        });
    }
    createPutFollowRequestItems(followeeAlias, followerAliasList) {
        let follwerAliasList = followerAliasList.map(followerAlias => this.createPutFollowRequest(followerAlias, followeeAlias));
        return follwerAliasList;
    }
    createPutFollowRequest(followerAlias, followeeAlias) {
        let item = {
            [this.PRIMARY_KEY]: followerAlias,
            [this.SORT_KEY]: followeeAlias,
        };
        let request = {
            PutRequest: {
                Item: item
            }
        };
        return request;
    }
    putUnprocessedItems(resp, params, attempts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (attempts > 1)
                console.log(attempts + 'th attempt starting');
            ;
            if (resp.UnprocessedItems != undefined) {
                let sec = 0.03;
                if (Object.keys(resp.UnprocessedItems).length > 0) {
                    console.log(Object.keys(resp.UnprocessedItems[this.TABLE_NAME]).length + ' unprocessed items');
                    //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
                    // @ts-ignore 
                    params.RequestItems = resp.UnprocessedItems;
                    (0, child_process_1.execSync)('sleep ' + sec);
                    if (sec < 10)
                        sec += 0.1;
                    yield BatchService_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params))
                        .then((innerResp) => __awaiter(this, void 0, void 0, function* () {
                        if (innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0) {
                            params.RequestItems = innerResp.UnprocessedItems;
                            ++attempts;
                            yield this.putUnprocessedItems(innerResp, params, attempts);
                        }
                    })).catch(err => {
                        console.log('error while batch writing unprocessed items ' + err);
                    });
                }
            }
        });
    }
}
exports.FollowDaoFillTable = FollowDaoFillTable;
function getServerVariable(val) {
    let server_val = process.env[val];
    if (server_val === undefined)
        throw new Error(val + " not found in the .server file.");
    else
        return server_val;
}
exports.getServerVariable = getServerVariable;

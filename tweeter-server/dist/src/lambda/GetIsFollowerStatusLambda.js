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
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const DynamoDBDaoFactory_1 = require("../DAO/DynamoDBDaoFactory");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let request = tweeter_shared_1.GetIsFollowerStatusRequest.fromJson(event);
    return new FollowService_1.FollowService(yield new DynamoDBDaoFactory_1.DynamoDBDaoFactory()).getIsFollowerStatus(request);
});
exports.handler = handler;

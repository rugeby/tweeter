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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowDao_1 = require("../DAO/FollowDao");
const UpdateFeedSQS_1 = __importDefault(require("../SQS/UpdateFeedSQS"));
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        let followDao = new FollowDao_1.FollowDao();
        let timestamp = Date.now();
        for (let i = 0; i < event.Records.length; ++i) {
            const { body } = event.Records[i];
            let request = JSON.parse(body);
            let followers = yield followDao.getJustFollowersAlias(request.senderName);
            let batch = [];
            for (let i = 0; i < followers.length; i++) {
                batch.push(followers[i]);
                if (batch.length == 25) {
                    yield (0, UpdateFeedSQS_1.default)(request.senderName, request.post, batch, timestamp);
                    batch = [];
                }
            }
            if (batch.length > 0) {
                yield (0, UpdateFeedSQS_1.default)(request.senderName, request.post, batch, timestamp);
                batch = [];
            }
        }
    });
};
exports.handler = handler;

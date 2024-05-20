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
const FeedDao_1 = require("../DAO/FeedDao");
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        let feedDAO = new FeedDao_1.FeedDao();
        for (let i = 0; i < event.Records.length; ++i) {
            const { body } = event.Records[i];
            let request = JSON.parse(body);
            let followers = request.followers;
            for (let i = 0; i < followers.length; i++) {
                yield feedDAO.putFeed(followers[i], request.timeStamp, request.post, request.senderName);
            }
        }
    });
};
exports.handler = handler;

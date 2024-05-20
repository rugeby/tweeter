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
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const tweeter_shared_2 = require("tweeter-shared");
const ServiceFactory_1 = require("./ServiceFactory");
const PostStatusSQS_1 = __importDefault(require("../../SQS/PostStatusSQS"));
class StatusService extends ServiceFactory_1.ServiceFactory {
    loadMoreStoryItems(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a Authtoken");
            }
            if (event.pageSize == null) {
                throw new Error("[Bad Request] Missing pageSize");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a user");
            }
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                let status = null;
                try {
                    status = yield this.createStoryProvider().getStory(event.user.alias, event.lastItem, event.pageSize);
                    status.values.forEach(s => s.user = event.user);
                    yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                }
                catch (err) {
                    throw new Error("[Bad Request] " + err.message);
                }
                //let status: [Status[], boolean]
                if (status) {
                    return new tweeter_shared_1.LoadMoreFeedStoryResponse(true, status.values, status.hasMorePages);
                }
                else
                    throw new Error("No story posted");
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
    loadMoreFeedItems(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a Authtoken");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a User");
            }
            if (event.pageSize == null) {
                throw new Error("[Bad Request] Missing a pageSize");
            }
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                let status = [];
                let hasMorePages = false;
                try {
                    let tempStatus = [];
                    let feedItems = yield this.createFeedProvider().getFeed(event.user.alias, event.lastItem, event.pageSize);
                    hasMorePages = feedItems.hasMorePages;
                    tempStatus = feedItems.values;
                    console.log(tempStatus);
                    const userPromises = tempStatus.map((ts) => __awaiter(this, void 0, void 0, function* () {
                        return this.createUserProvider().getUser(ts.userAlias);
                    }));
                    const users = yield Promise.all(userPromises);
                    users.forEach((user, index) => {
                        if (user) {
                            let s = new tweeter_shared_2.Status(tempStatus[index].post, user, tempStatus[index].timeStamp);
                            status.push(s);
                        }
                        else {
                            console.error(`User with alias ${tempStatus[index].userAlias} not found.`);
                        }
                    });
                }
                catch (e) {
                    throw new Error("[Bad Request] " + e.message);
                }
                yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                return new tweeter_shared_1.LoadMoreFeedStoryResponse(true, status, hasMorePages, undefined);
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
    postStatus(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a Authtoken");
            }
            if (event.newStatus == null) {
                throw new Error("[Bad Request] Missing a newStatus");
            }
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                event.newStatus.timestamp = Date.now();
                yield this.createStoryProvider().putStory(event.newStatus);
                // let followersAliases = await this.createFollowProvider().getJustFollowersAlias(event.newStatus.user.alias);
                // followersAliases.forEach(async alias =>{
                //   await this.createFeedProvider().putFeed(alias, event.newStatus);
                // })
                (0, PostStatusSQS_1.default)(event.newStatus.user.alias, event.newStatus.post);
                yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                yield new Promise((f) => setTimeout(f, 2000));
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
}
exports.StatusService = StatusService;

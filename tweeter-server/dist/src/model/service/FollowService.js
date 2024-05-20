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
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ServiceFactory_1 = require("./ServiceFactory");
class FollowService extends ServiceFactory_1.ServiceFactory {
    loadMoreFollowers(
    //get
    event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a user");
            }
            if (event.pageSize == null) {
                throw new Error("[Bad Request] Missing a pageSize");
            }
            let pageOfUsers = null;
            let users = [];
            let hasMore = false;
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                try {
                    pageOfUsers = yield this.createFollowProvider().getFollowers(event.user.alias, event.lastItem, event.pageSize);
                    for (let i = 0; i < pageOfUsers.values.length; i++) {
                        console.log(pageOfUsers.values[i]);
                        const alias = pageOfUsers.values[i];
                        let user = yield this.createUserProvider().getUser(alias);
                        users.push(user);
                    }
                    hasMore = pageOfUsers.hasMorePages;
                }
                catch (e) {
                    throw new Error("[Bad Request] " + e.message);
                }
                yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                if (pageOfUsers)
                    return new tweeter_shared_1.LoadMoreFollowersResponse(true, undefined, users, hasMore);
                else
                    throw new Error("[Not Found] Page of users not found in Data.");
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
    loadMoreFollowees(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a user");
            }
            if (event.pageSize == null) {
                throw new Error("[Bad Request] Missing a pageSize");
            }
            let pageOfUsers = null;
            let users = [];
            let hasMore = false;
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                try {
                    pageOfUsers = yield this.createFollowProvider().getFollowees(event.user.alias, event.lastItem, event.pageSize);
                    for (let i = 0; i < pageOfUsers.values.length; i++) {
                        const alias = pageOfUsers.values[i];
                        let user = yield this.createUserProvider().getUser(alias);
                        users.push(user);
                    }
                    hasMore = pageOfUsers.hasMorePages;
                }
                catch (e) {
                    throw new Error("[Bad Request] " + e.message);
                }
                if (pageOfUsers)
                    return new tweeter_shared_1.LoadMoreFolloweesResponse(true, undefined, users, hasMore);
                else
                    throw new Error("[Not Found] Page of users not found in Data.");
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
    getIsFollowerStatus(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a user");
            }
            if (event.selectedUser == null) {
                throw new Error("[Bad Request] Missing a selectUser");
            }
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                let isFollower = yield this.createFollowProvider().isFollower(event.user.alias, event.selectedUser.alias);
                yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                return new tweeter_shared_1.GetIsFollowerStatusResponse(true, isFollower, undefined);
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
    getFolloweesCount(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a user");
            }
            let followeesCount = null;
            try {
                followeesCount = yield this.createFollowProvider().getFolloweesCount(event.user.alias);
            }
            catch (err) {
                throw new Error("[Bad Request] " + err.message);
            }
            yield this.createAuthTokenProvider().putAuthToken(event.authToken);
            return new tweeter_shared_1.GetFolloweesCountResponse(true, followeesCount);
        });
    }
    ;
    getFollowersCount(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (event.user == null) {
                throw new Error("[Bad Request] Missing a user");
            }
            let followersCount = null;
            let isSuccess = false;
            try {
                followersCount = yield this.createFollowProvider().getFollowersCount(event.user.alias);
                isSuccess = true;
            }
            catch (err) {
                throw new Error("[Bad Request] " + err.message);
            }
            yield this.createAuthTokenProvider().putAuthToken(event.authToken);
            return new tweeter_shared_1.GetFollowersCountResponse(isSuccess, followersCount);
        });
    }
    ;
    follow(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (event.userToFollow == null) {
                throw new Error("[Bad Request] Missing a userToFollow");
            }
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                yield this.createFollowProvider().putFollow(event.loginUser.alias, event.userToFollow.alias);
                let countRequest = new tweeter_shared_1.GetAuthTokenandUserRequest(event.authToken, event.userToFollow);
                let followersCount = yield this.getFollowersCount(countRequest);
                let followeesCount = yield this.getFolloweesCount(countRequest);
                if (followersCount === null || followeesCount === null) {
                    throw new Error("[Bad Request] Missing 'FollowersCount' or 'FolloweesCount' field");
                }
                let followResponse = new tweeter_shared_1.FollowResponse(true, undefined, followersCount.followersCount, followeesCount.followeesCount);
                yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                return followResponse;
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
    unfollow(
    //delete
    event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                yield this.createFollowProvider().deleteFollow(event.loginUser.alias, event.userToUnfollow.alias);
                let countRequest = new tweeter_shared_1.GetAuthTokenandUserRequest(event.authToken, event.userToUnfollow);
                let followersCount = yield this.getFollowersCount(countRequest);
                let followeesCount = yield this.getFolloweesCount(countRequest);
                if (followersCount === null || followeesCount === null) {
                    throw new Error("[Bad Request] Missing 'FollowersCount' or 'FolloweesCount' field");
                }
                let followResponse = new tweeter_shared_1.UnfollowResponse(true, followersCount.followersCount, followeesCount.followeesCount);
                yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                return followResponse;
            }
            else {
                throw new Error("login time expired");
            }
        });
    }
    ;
}
exports.FollowService = FollowService;

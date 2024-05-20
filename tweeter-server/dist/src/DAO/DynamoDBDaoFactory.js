"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBDaoFactory = void 0;
const AuthTokenDao_1 = require("./AuthTokenDao");
const FeedDao_1 = require("./FeedDao");
const FollowDao_1 = require("./FollowDao");
const S3Dao_1 = require("./S3Dao");
const StoryDao_1 = require("./StoryDao");
const UserDao_1 = require("./UserDao");
class DynamoDBDaoFactory {
    userProvider() {
        return new UserDao_1.UserDAO();
    }
    feedProvider() {
        return new FeedDao_1.FeedDao();
    }
    storyProvider() {
        return new StoryDao_1.StoryDao();
    }
    authTokenProvider() {
        return new AuthTokenDao_1.AuthTokenDao();
    }
    followProvider() {
        return new FollowDao_1.FollowDao();
    }
    s3Provider() {
        return new S3Dao_1.S3Dao();
    }
}
exports.DynamoDBDaoFactory = DynamoDBDaoFactory;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFactory = void 0;
class ServiceFactory {
    constructor(daoFactory) {
        this.userProvider = null;
        this.feedProvider = null;
        this.storyProvider = null;
        this.authTokenProvider = null;
        this.followProvider = null;
        this.s3Provider = null;
        this.daoFactory = daoFactory;
    }
    createUserProvider() {
        if (this.userProvider === null) {
            this.userProvider = this.daoFactory.userProvider();
        }
        return this.userProvider;
    }
    createFeedProvider() {
        if (this.feedProvider === null) {
            this.feedProvider = this.daoFactory.feedProvider();
        }
        return this.feedProvider;
    }
    createStoryProvider() {
        if (this.storyProvider === null) {
            this.storyProvider = this.daoFactory.storyProvider();
        }
        return this.storyProvider;
    }
    createAuthTokenProvider() {
        if (this.authTokenProvider === null) {
            this.authTokenProvider = this.daoFactory.authTokenProvider();
        }
        return this.authTokenProvider;
    }
    createFollowProvider() {
        if (this.followProvider === null) {
            this.followProvider = this.daoFactory.followProvider();
        }
        return this.followProvider;
    }
    createS3Provider() {
        if (this.s3Provider === null) {
            this.s3Provider = this.daoFactory.s3Provider();
        }
        return this.s3Provider;
    }
}
exports.ServiceFactory = ServiceFactory;

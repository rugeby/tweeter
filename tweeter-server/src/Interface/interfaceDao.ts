import { AuthToken, Status, User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { StatusFeed } from "tweeter-shared/dist/model/domain/Status";

export interface UserProvider {
    putUser(user: User, password: string): Promise<void>;
    getUser(alias: string): Promise<User| undefined>;
    getUserPassword(alias:string):Promise<string|undefined>;
    getFollowersCount(alias:string):Promise<number>;
    getFollowingsCount(alias:string):Promise<number>;
    increaseFollowersCount(alias:string):Promise<void>;
    decreaseFollowersCount(alias:string):Promise<void>;
    increaseFollowingCount(alias:string):Promise<void>;
    decreaseFollowingCount(alias:string):Promise<void>;
}
export interface FeedProvider {
    putFeed(receiverAlias:string, timeStamp:number, post:String, posterAlias:string):Promise<void>
    getFeed(userAlias:string, lastItem:Status, pageSize:number):Promise<DataPage<StatusFeed>>;
}

export interface StoryProvider {
    putStory(status:Status):Promise<void>
    getStory(userAlias:string, lastItem:Status, pageSize:number):Promise<DataPage<Status>>

}

export interface AuthTokenProvider {
    putAuthToken(authToken:AuthToken):Promise<void>;
    getAuthToken(authToken:AuthToken):Promise<AuthToken|undefined>;
    deleteAuthToken(authToken: AuthToken): Promise<void>;
    isvalidateAuth(authToken:AuthToken):Promise<boolean>;
}


export interface FollowProvider {
    putFollow(followerAlias:string, followeeAlias:string):Promise<void>;
    deleteFollow(followerAlias:string, followeeAlias:string):Promise<void>;
    getFollowees(followerAlias:string,  lastUser:User, pageSize:number):Promise<DataPage<string>>;
    getFollowers(followeeAlias: string, lastUser: User, pageSize: number): Promise<DataPage<string>>;
    getJustFollowersAlias(userAlias:string):Promise<string[]>;
    //getFolloweesCount(followerAlias:string):Promise<number>;
    //getFollowersCount(followeeAlias:string):Promise<number>;
    isFollower(userAlias:string, selectedUserAlias:string):Promise<boolean>
}

export interface S3Provider {
    putImage(filename:string, image_url: string): Promise<string>;
}

export interface DaoFactory {
    userProvider(): UserProvider;
    feedProvider(): FeedProvider;
    storyProvider(): StoryProvider;
    authTokenProvider(): AuthTokenProvider;
    followProvider(): FollowProvider;
    s3Provider(): S3Provider;

}
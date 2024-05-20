import { AuthTokenProvider, DaoFactory, FeedProvider, FollowProvider, S3Provider, StoryProvider, UserProvider } from "../Interface/interfaceDao";
import { AuthTokenDao } from "./AuthTokenDao";
import { FeedDao } from "./FeedDao";
import { FollowDao } from "./FollowDao";
import { S3Dao } from "./S3Dao";
import { StoryDao } from "./StoryDao";
import { UserDAO } from "./UserDao";

export class DynamoDBDaoFactory implements DaoFactory {
    userProvider(): UserProvider {
        return new UserDAO();
    }
    feedProvider(): FeedProvider {
        return new FeedDao();
    }
    storyProvider(): StoryProvider {
        return new StoryDao();      
    }
    authTokenProvider(): AuthTokenProvider {
        return new AuthTokenDao();
    }
    followProvider(): FollowProvider {
        return new FollowDao();
    }
    s3Provider(): S3Provider {
        return new S3Dao();
    }
}
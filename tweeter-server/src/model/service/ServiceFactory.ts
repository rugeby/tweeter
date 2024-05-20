import { AuthTokenProvider, DaoFactory, FeedProvider, FollowProvider, S3Provider, StoryProvider, UserProvider } from "../../Interface/interfaceDao";


export class ServiceFactory {

    private daoFactory: DaoFactory;
    private userProvider: UserProvider | null = null;
    private feedProvider: FeedProvider | null = null;
    private storyProvider: StoryProvider | null = null;
    private authTokenProvider: AuthTokenProvider | null = null;
    private followProvider: FollowProvider | null = null;
    private s3Provider: S3Provider | null = null;
    
    constructor(daoFactory: DaoFactory) 
    {
        this.daoFactory = daoFactory;

    }

    protected createUserProvider(): UserProvider {

        
        if (this.userProvider === null) {
          this.userProvider = this.daoFactory.userProvider();
        }
        return this.userProvider;
    }


    protected createFeedProvider(): FeedProvider {

        if (this.feedProvider === null) {
          this.feedProvider = this.daoFactory.feedProvider();
        }
        return this.feedProvider;
    }


    protected createStoryProvider(): StoryProvider {

        if (this.storyProvider === null) {
          this.storyProvider = this.daoFactory.storyProvider();
        }
        return this.storyProvider;
    }

    protected createAuthTokenProvider(): AuthTokenProvider {

        if (this.authTokenProvider === null) {
          this.authTokenProvider = this.daoFactory.authTokenProvider();
        }
        return this.authTokenProvider;
    }
    

    protected createFollowProvider(): FollowProvider {

        if (this.followProvider === null) {
          this.followProvider = this.daoFactory.followProvider();
        }
        return this.followProvider;
    }

    protected createS3Provider(): S3Provider {

        if (this.s3Provider === null) {
          this.s3Provider = this.daoFactory.s3Provider();
        }
        return this.s3Provider;
    }


}
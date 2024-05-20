import { AuthToken, FakeData, FollowRequest, GetAuthTokenandUserRequest, GetIsFollowerStatusRequest, LoadMoreCyberHumanRequest, UnfollowRequest, User } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService{
    public async loadMoreFollowers (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]>{
        // TODO: Replace with the result of calling server

        let request = new LoadMoreCyberHumanRequest(authToken, user, pageSize, lastItem);
        let response = await ServerFacade.instance.loadMoreFollowers(request);
    
        let users: User[] = response.followers;
        let loadMore : boolean = response.loadMore;

        if (users === null) {
          throw new Error("[Bad Request] Missing 'Users' field");
        } 
        if (loadMore === null) {
          throw new Error("[Bad Request] Missing 'LoadMore' field");
        }

        return [users, loadMore];
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {

        let request = new LoadMoreCyberHumanRequest(authToken, user, pageSize, lastItem);
        console.log("tweeterweb lastItem:", lastItem);
        let response = await ServerFacade.instance.loadMoreFollowees(request);
    
        let users = response.followees;
        let loadMore : boolean = response.loadMore;
    
        if (users === null) {
          throw new Error("[Bad Request] Missing 'Users' field");
        } else if (loadMore === null) {
          throw new Error("[Bad Request] Missing 'LoadMore' field");
        }
    
        return [users, loadMore];
      };

      public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        let request = new GetIsFollowerStatusRequest(authToken, user, selectedUser);
        let response = await ServerFacade.instance.getIsFollowerStatus(request);

        let isFollower = response.isFollower;

        if (isFollower === null) {
          throw new Error("[Bad Request] Missing 'IsFollower' field");
        }

        return isFollower;
      };

      public async getFolloweesCount(
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        let request = new GetAuthTokenandUserRequest(authToken, user);
        let response = await ServerFacade.instance.getFolloweesCount(request);

        let followeesCount = response.followeesCount;

        if (followeesCount === null) {
          throw new Error("[Bad Request] Missing 'FolloweesCount' field");
        }

        return followeesCount;
      };

      public async getFollowersCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        let request = new GetAuthTokenandUserRequest(authToken, user);
        let response = await ServerFacade.instance.getFollowersCount(request);

        let followersCount = response.followersCount;

        if (followersCount === null) {
          throw new Error("[Bad Request] Missing 'FollowersCount' field");
        }


        return followersCount;
      };

 
      public async follow (
        authToken: AuthToken,
        userToFollow: User,
        loginUser:User
      ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        let request = new FollowRequest(authToken, userToFollow, loginUser);
        let response = await ServerFacade.instance.follow(request);
        
    
    
        if(response.followersCount === null || response.followeesCount === null){
          throw new Error("[Bad Request] Missing 'FollowersCount' or 'FolloweesCount' field");
        }
    
        return [response.followersCount, response.followeesCount];
      };

    
      public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User,
        loginUser:User
      ): Promise<[followersCount: number, followeesCount: number]>  {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        let request = new UnfollowRequest(authToken, userToUnfollow, loginUser);
        let response = await ServerFacade.instance.unfollow(request);

        if(response.followersCount === null || response.followeesCount === null){
          throw new Error("[Bad Request] Missing 'FollowersCount' or 'FolloweesCount' field");
        }

        return [response.followersCount, response.followeesCount];
  };



      
}
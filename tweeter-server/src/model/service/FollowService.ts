import { FollowRequest, FollowResponse, GetAuthTokenandUserRequest, GetFolloweesCountResponse, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreCyberHumanRequest, LoadMoreFolloweesResponse, LoadMoreFollowersResponse, Status, UnfollowRequest, UnfollowResponse, User } from "tweeter-shared"; 
import { ServiceFactory } from "./ServiceFactory";

export class FollowService extends ServiceFactory{
    public async loadMoreFollowers (
      //get
        event:LoadMoreCyberHumanRequest
      ): Promise<LoadMoreFollowersResponse>{
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a authToken");
        }
        if(event.user == null){
          throw new Error("[Bad Request] Missing a user");
        }
        if(event.pageSize == null){
          throw new Error("[Bad Request] Missing a pageSize");
        }
        let pageOfUsers = null;
        let users:any[] = [];
        let hasMore = false;

        if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){
        
        try{
          pageOfUsers = await this.createFollowProvider().getFollowers(event.user.alias, event.lastItem!, event.pageSize);
          for (let i = 0; i < pageOfUsers.values.length; i++) {
            console.log(pageOfUsers.values[i]);
            const alias = pageOfUsers.values[i];
            let user = await this.createUserProvider().getUser(alias);
            users.push(user);
          }
          hasMore = pageOfUsers.hasMorePages;
          
        }catch(e){ 
          throw new Error("[Bad Request] " + (e as Error).message);
        }
        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        if (pageOfUsers) return new LoadMoreFollowersResponse(true, undefined, users, hasMore);
        else throw new Error("[Not Found] Page of users not found in Data.");
      }
      else{
        throw new Error("login time expired");
      }
    
    };

    
      public async loadMoreFollowees (
        event:LoadMoreCyberHumanRequest
      ): Promise<LoadMoreFolloweesResponse> {
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a authToken");
        }
        if(event.user == null){
          throw new Error("[Bad Request] Missing a user");
        }
        if(event.pageSize == null){
          throw new Error("[Bad Request] Missing a pageSize");
        }
        

        let pageOfUsers = null;
        let users:any[] = [];
        let hasMore = false;

      if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){
        
        try{     

          pageOfUsers = await this.createFollowProvider().getFollowees(event.user.alias, event.lastItem!, event.pageSize);
          for (let i = 0; i < pageOfUsers.values.length; i++) {
            const alias = pageOfUsers.values[i];
            let user = await this.createUserProvider().getUser(alias);
            users.push(user);
          }
          hasMore = pageOfUsers.hasMorePages;
      
          
        }catch(e){
          throw new Error("[Bad Request] " + (e as Error).message);
        }
        if (pageOfUsers) return new LoadMoreFolloweesResponse(true, undefined, users, hasMore);
        else throw new Error("[Not Found] Page of users not found in Data.");
      }
      else{
        throw new Error("login time expired");
      }
      };

      public async getIsFollowerStatus(
        event:GetIsFollowerStatusRequest
      ): Promise<GetIsFollowerStatusResponse> {
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a authToken");
        }
        if(event.user == null){
          throw new Error("[Bad Request] Missing a user");
        }
        if(event.selectedUser == null){
          throw new Error("[Bad Request] Missing a selectUser");
        }
        if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){

        let isFollower = await this.createFollowProvider().isFollower(event.user.alias, event.selectedUser.alias);
        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        return new GetIsFollowerStatusResponse(true, isFollower, undefined);
        }
        else{
          throw new Error("login time expired");
        }
      };

      public async getFolloweesCount(
        event:GetAuthTokenandUserRequest
      ): Promise<GetFolloweesCountResponse> {
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a authToken");
        }
        if(event.user == null){
          throw new Error("[Bad Request] Missing a user");
        }
        let followeesCount = null;

        try {
          followeesCount = await this.createUserProvider().getFollowingsCount(event.user.alias);

        } catch (err) {
          throw new Error("[Bad Request] " + (err as Error).message);
        }
        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        return new GetFolloweesCountResponse(true, followeesCount);


      };

      public async getFollowersCount (
        event:GetAuthTokenandUserRequest
      ): Promise<GetFollowersCountResponse> {
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a authToken");
        }
        if(event.user == null){
          throw new Error("[Bad Request] Missing a user");
        }
        let followersCount = null;
        let isSuccess = false;
        
      try {
        followersCount = await this.createUserProvider().getFollowersCount(event.user.alias);
        isSuccess = true;
      } catch (err) {
        throw new Error("[Bad Request] " + (err as Error).message);
      }
      await this.createAuthTokenProvider().putAuthToken(event.authToken);
      return new GetFollowersCountResponse(isSuccess, followersCount);
      };

 
      public async follow (
        event:FollowRequest
      ): Promise<FollowResponse> {
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a authToken");
        }
        if(event.userToFollow == null){
          throw new Error("[Bad Request] Missing a userToFollow");
        }

        if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){
        await this.createFollowProvider().putFollow(event.loginUser.alias, event.userToFollow.alias);
        await this.createUserProvider().increaseFollowingCount(event.loginUser.alias);
        await this.createUserProvider().increaseFollowersCount(event.userToFollow.alias);
        let countRequest = new GetAuthTokenandUserRequest(event.authToken, event.userToFollow)
      
        let followersCount = await this.getFollowersCount(countRequest);
        let followeesCount = await this.getFolloweesCount(countRequest);

        if(followersCount === null|| followeesCount === null){
          throw new Error("[Bad Request] Missing 'FollowersCount' or 'FolloweesCount' field");
        }
        let followResponse = new FollowResponse(true, undefined, followersCount.followersCount, followeesCount.followeesCount);
        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        return followResponse;
      }
      else{
        throw new Error("login time expired");
      }
      };

    
      public async unfollow (
        //delete
        event:UnfollowRequest
      ): Promise<UnfollowResponse>  {
        if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){
        await this.createFollowProvider().deleteFollow(event.loginUser.alias, event.userToUnfollow.alias);
        await this.createUserProvider().decreaseFollowingCount(event.loginUser.alias);
        await this.createUserProvider().decreaseFollowersCount(event.userToUnfollow.alias);
        let countRequest = new GetAuthTokenandUserRequest(event.authToken, event.userToUnfollow);

        let followersCount = await this.getFollowersCount(countRequest);
        let followeesCount = await this.getFolloweesCount(countRequest);

        if(followersCount === null|| followeesCount === null){
          throw new Error("[Bad Request] Missing 'FollowersCount' or 'FolloweesCount' field");
        }
        let followResponse = new UnfollowResponse(true, followersCount.followersCount, followeesCount.followeesCount);
        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        return followResponse;}
        else{
          throw new Error("login time expired");
        }
  };

  


}
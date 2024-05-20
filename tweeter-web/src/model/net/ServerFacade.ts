
import { AuthenticateResponse, GetUserRequest, GetUserResponse, LoadMoreFeedStoryResponse, LoadMoreFollowersResponse, LoginRequest, LogoutRequest, LogoutResponse, PostStatusRequest, RegisterRequest, TweeterResponse, loadMoreItemsRequest, LoadMoreCyberHumanRequest, LoadMoreFolloweesResponse, GetAuthTokenandUserRequest, GetFolloweesCountResponse, GetFollowersCountResponse, FollowRequest, FollowResponse, UnfollowRequest, UnfollowResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";


export class ServerFacade {

  private SERVER_URL = "https://acyeb87fag.execute-api.us-east-2.amazonaws.com/service";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
  static instance: ServerFacade = new ServerFacade(); 

  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/login";
    const response: AuthenticateResponse = 
    await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(
      request, 
      endpoint);

    return AuthenticateResponse.fromJson(response);
  }

  public async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "/register";
    const response: AuthenticateResponse = 
    await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(
      request, 
      endpoint);

    return AuthenticateResponse.fromJson(response);
  }

  public async getUser(request:GetUserRequest): Promise<GetUserResponse> {
    const endpoint = "/getUser";
    const response: GetUserResponse = 
    await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(
      request, 
      endpoint);

    return GetUserResponse.fromJson(response);
  }

  public async logout(request:LogoutRequest): Promise<LogoutResponse> {
    const endpoint = "/logout";
    const response: LogoutResponse = 
    await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(
      request, 
      endpoint);

    return new TweeterResponse(true);
  }

  public async loadMoreStoryItem(request:loadMoreItemsRequest): Promise<LoadMoreFeedStoryResponse> {
    const endpoint = "/loadMoreStoryItems";
    const response = await this.clientCommunicator.doPost<loadMoreItemsRequest, LoadMoreFeedStoryResponse>(request, endpoint);

    return LoadMoreFeedStoryResponse.fromJson(response);
  }
 
  public async loadMoreFeedItems(request:loadMoreItemsRequest): Promise<LoadMoreFeedStoryResponse> {
    const endpoint = "/loadMoreFeedItems";
    const response = await this.clientCommunicator.doPost<loadMoreItemsRequest, LoadMoreFeedStoryResponse>(request, endpoint);
    return LoadMoreFeedStoryResponse.fromJson(response);
  }

  public async postStatus(request:PostStatusRequest): Promise<TweeterResponse> {
    const endpoint = "/postStatus";
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);

    return new TweeterResponse(true);
  }

  public async loadMoreFollowers(request:LoadMoreCyberHumanRequest): Promise<LoadMoreFollowersResponse> {
    const endpoint = "/loadMoreFollowers";
    const response = await this.clientCommunicator.doPost<LoadMoreCyberHumanRequest, LoadMoreFollowersResponse>(request, endpoint);

    return LoadMoreFollowersResponse.fromJson(response)
  }

  public async loadMoreFollowees(request:LoadMoreCyberHumanRequest): Promise<LoadMoreFolloweesResponse> {
    const endpoint = "/loadMoreFollowees";
    const response = await this.clientCommunicator.doPost<LoadMoreCyberHumanRequest,LoadMoreFolloweesResponse>(request, endpoint);

    return LoadMoreFolloweesResponse.fromJson(response)
  }

  public async getIsFollowerStatus(request:GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    const endpoint = "/getIsFollowerStatus";
    const response = await this.clientCommunicator.doPost<GetIsFollowerStatusRequest, GetIsFollowerStatusResponse>(request, endpoint);

    return GetIsFollowerStatusResponse.fromJson(response)
  }

  public async getFolloweesCount(request:GetAuthTokenandUserRequest): Promise<GetFolloweesCountResponse> {
    const endpoint = "/getFolloweesCount";
    const response = await this.clientCommunicator.doPost<GetAuthTokenandUserRequest, GetFolloweesCountResponse>(request, endpoint);

    return GetFolloweesCountResponse.fromJson(response)
  }

  public async getFollowersCount (request:GetAuthTokenandUserRequest): Promise<GetFollowersCountResponse> {
    const endpoint = "/getFollowersCount";
    const response = await this.clientCommunicator.doPost<GetAuthTokenandUserRequest,GetFollowersCountResponse>(request, endpoint);

    return GetFollowersCountResponse.fromJson(response)
  }

  public async follow (request:FollowRequest): Promise<FollowResponse> {
    const endpoint = "/follow";
    const response = await this.clientCommunicator.doPost<FollowRequest,FollowResponse>(request, endpoint);

    return FollowResponse.fromJson(response)
  }

  public async unfollow (request:UnfollowRequest): Promise<UnfollowResponse> {
    const endpoint = "/unfollow";
    const response = await this.clientCommunicator.doPost<UnfollowRequest,UnfollowResponse>(request, endpoint);

    return UnfollowResponse.fromJson(response)
  }





  



  
}
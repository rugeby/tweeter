import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";


export class TweeterResponse {
  private _success: boolean;
  private _message: string | null;

  constructor(success: boolean, message: string | null = null) {
    this._success = success;
    this._message = message;
  }

  get success() {
    return this._success;
  }

  get message() {
    return this._message;
  }
}


interface ResponseJson {
  _success: boolean;
  _message: string;
}

export class AuthenticateResponse extends TweeterResponse {
  private _user: User;
  private _token: AuthToken;

  constructor(
    success: boolean,
    user: User,
    token: AuthToken,
    message: string | null = null
  ) {
    super(success, message);
    this._user = user;
    this._token = token;
  }

  get user() {
    return this._user;
  }

  get token() {
    return this._token;
  }

  static fromJson(json: AuthenticateResponse): AuthenticateResponse {
    interface AuthenticateResponseJson extends ResponseJson {
      _user: JSON;
      _token: JSON;
    }

    const jsonObject: AuthenticateResponseJson =
      json as unknown as AuthenticateResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

    if (deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject._user)
      );
    }

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject._token)
    );

    if (deserializedToken === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject._token)
      );
    }

    return new AuthenticateResponse(
      jsonObject._success,
      deserializedUser,
      deserializedToken,
      jsonObject._message
    );
  }
}

export class GetUserResponse extends TweeterResponse{
  user:User;
  constructor(
    success: boolean,
    message:string|null = null, 
    user:User){
    super(success, message);
    this.user = user;
  }

  static fromJson(response: GetUserResponse): GetUserResponse {
    let deserializedUser = User.fromJson(JSON.stringify(response.user));

    if (deserializedUser === null) {
      throw new Error(
        "GetUserResponse can't desearial user with Json:\n" +
          JSON.stringify(response.user)
      );
    }

    let deserializedResponse = new GetUserResponse(
      response.success,
      response.message,
      response.user
    )

    return deserializedResponse;

   
  }
}


export class LogoutResponse extends TweeterResponse{
  constructor(
    success:boolean,
    message:string|null = null){
      super(success, message);
    }
}



export class LoadMoreFeedStoryResponse extends TweeterResponse{
  _statuses: Status[];
  _loadMore: boolean;

  constructor(
    success: boolean,
    statuses: Status[],
    loadMore: boolean,
    message: string | null = null
  ) {
    super(success, message);
    this._statuses = statuses;
    this._loadMore = loadMore;
  }

  set loadMore(loadMore:boolean){
    this._loadMore = loadMore;
  }

  get statuses() {
    return this._statuses;
  }
  get loadMore() {
    return this._loadMore;
  }


  static fromJson(response: LoadMoreFeedStoryResponse): LoadMoreFeedStoryResponse {

    let statusList:Status[] = [];
    console.log("Response from JSon:", JSON.stringify(response))

    for(let statusListIndex in response._statuses){
      let statusJson = response._statuses[statusListIndex];
  
      let deserializedStatuses = Status.fromJson(JSON.stringify(statusJson));

       if (deserializedStatuses === null){
        throw new Error(
          "FeedItemsResponse, could not deserialize statuses with json:\n" +
          JSON.stringify(response._statuses)
        );
       }
       else{
        statusList.push(deserializedStatuses);
       }
  }


      let deserializedResponse = new LoadMoreFeedStoryResponse(
      response.success,
      statusList,
      response._loadMore,
      response.message
    );
    return deserializedResponse;
  }


}

export class LoadMoreFollowersResponse extends TweeterResponse{
  followers:User[];
  loadMore:boolean;

  constructor(
    success:boolean, 
    message:string|null = null,
    followers:User[], 
    loadMore:boolean){
    super(success, message);
    this.followers=followers;
    this.loadMore = loadMore;
  }

  static fromJson(response: LoadMoreFollowersResponse): LoadMoreFollowersResponse {
    let deserializedFollowers = response.followers.map((user) =>
      User.fromJson(JSON.stringify(user))
    );
    if (deserializedFollowers === null)
      throw new Error(
        "FollowersResponse, could not deserialize followers with json:\n" +
        JSON.stringify(response.followers)
      );
    let deserializedResponse = new LoadMoreFollowersResponse(
      response.success,
      response.message,
      deserializedFollowers.map((user) => user!).filter((user) => user !== null) as User[],
      response.loadMore,
    
    );
    return deserializedResponse;
  }
}


export class LoadMoreFolloweesResponse extends TweeterResponse{
  followees:User[];
  loadMore:boolean;

  constructor(
    success:boolean, 
    message:string|null = null,
    followees:User[], 
    loadMore:boolean){
    super(success, message);
    this.followees = followees;
    this.loadMore=loadMore;
  }

  static fromJson(response: LoadMoreFolloweesResponse): LoadMoreFolloweesResponse {
    let deserializedFollowees = response.followees.map((user) =>
      User.fromJson(JSON.stringify(user))
    );
    if (deserializedFollowees === null)
      throw new Error(
        "FolloweesResponse, could not deserialize followees with json:\n" +
        JSON.stringify(response.followees)
      );
    let deserializedResponse = new LoadMoreFolloweesResponse(
      response.success,
      response.message,
      deserializedFollowees.map((user) => user!).filter((user) => user !== null) as User[],
      response.loadMore,
    
    );
    return deserializedResponse;
  }
}


export class GetIsFollowerStatusResponse extends TweeterResponse{
  isFollower:boolean;
  constructor(
    success: boolean,
    isFollower: boolean,
    message: string | null = null
  ) {
    super(success, message);
    this.isFollower = isFollower;
  }

  static fromJson(response: GetIsFollowerStatusResponse): GetIsFollowerStatusResponse {
    let deserializedResponse = new GetIsFollowerStatusResponse(
      response.success,
      response.isFollower,
      response.message
    );
    return deserializedResponse;
  }
}


export class GetFolloweesCountResponse extends TweeterResponse{
  followeesCount:number;
  constructor(
    success: boolean,
    followeesCount: number,
    message: string | null = null
  ) {
    super(success, message);
    this.followeesCount = followeesCount;
  }

  static fromJson(response: GetFolloweesCountResponse): GetFolloweesCountResponse {
    let deserializedResponse = new GetFolloweesCountResponse(
      response.success,
      response.followeesCount,
      response.message
    );
    return deserializedResponse;
  }
}


export class GetFollowersCountResponse extends TweeterResponse {
  followersCount: number;

  constructor(
    success: boolean,
    followersCount: number,
    message: string | null = null
  ) {
    super(success, message);
    this.followersCount = followersCount;
  }

  static fromJson(response: GetFollowersCountResponse): GetFollowersCountResponse {
    let deserializedResponse = new GetFollowersCountResponse(
      response.success,
      response.followersCount,
      response.message
    );
    return deserializedResponse;
  }
}

export class FollowResponse extends TweeterResponse{
  followersCount: number;
  followeesCount: number;
  
  constructor(
    success: boolean,
    message: string | null = null,
    followersCount: number,
    followeesCount: number
  ) {
    super(success, message);
    this.followersCount = followersCount;
    this.followeesCount = followeesCount;
  }
  static fromJson(response: FollowResponse): FollowResponse {
    let deserializedResponse = new FollowResponse(
      response.success,
      response.message,
      response.followersCount,
      response.followeesCount,
      
    );
    return deserializedResponse;
  }
}

export class UnfollowResponse extends TweeterResponse {
  followersCount: number;
  followeesCount: number;

  constructor(
    success: boolean,
    followersCount: number,
    followeesCount: number,
    message: string | null = null
  ) {
    super(success, message);
    this.followersCount = followersCount;
    this.followeesCount = followeesCount;
  }

  static fromJson(response: UnfollowResponse): UnfollowResponse {
    let deserializedResponse = new UnfollowResponse(
      response.success,
      response.followersCount,
      response.followeesCount,
      response.message
    );
    return deserializedResponse;
  }
}










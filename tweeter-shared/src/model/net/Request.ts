import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterRequest{
    

}
export class RegisterRequest{
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    userImageBytes: string

    constructor(
        firstName: string, 
        lastName: string, 
        alias: string,
        password: string,
        userImageBytes: string){
            this.firstName = firstName;
            this.lastName =lastName;
            this.alias = alias;
            this.password = password;
            this.userImageBytes = userImageBytes;
        }


    }
    

export class LoginRequest{
    username: string;
    password: string;

    constructor(username:string, password:string){
        this.username = username;
        this.password = password;
    }
}

export class GetUserRequest{
    alias:string;
    authToken: AuthToken;
    constructor(alias:string, authToken:AuthToken){
        this.alias = alias;
        this.authToken= authToken;
    }

    static fromJson(request: GetUserRequest): GetUserRequest {
        let deserializedToken = AuthToken.fromJson(
          JSON.stringify(request.authToken)
        );
        if (deserializedToken === null) {
          throw new Error(
            "GetUserRequest could not deserialize token with json:\n" +
              JSON.stringify(deserializedToken)
          );
        }
        
    


        return new GetUserRequest(
            request.alias,
            deserializedToken
        );
      }


}

export class LogoutRequest{
    authToken:AuthToken;
    constructor(authToken:AuthToken){
        this.authToken = authToken;
    }
}


export class loadMoreItemsRequest{
        authToken: AuthToken;
        user: User;
        pageSize: number;
        lastItem: Status | null;

        constructor(
            authToken:AuthToken,
            user:User,
            pageSize:number,
            lastItem:Status|null
        ){
            this.authToken = authToken;
            this.user = user;
            this.pageSize=pageSize;
            this.lastItem=lastItem;
        }

        static fromJson(request: loadMoreItemsRequest): loadMoreItemsRequest {
            let deserializedToken = AuthToken.fromJson(
              JSON.stringify(request.authToken)
            );
            if (deserializedToken === null) {
              throw new Error(
                "IsFollowerStatusRequest could not deserialize token with json:\n" +
                  JSON.stringify(deserializedToken)
              );
            }
        

        
        
            let deserializatotionUser = User.fromJson(JSON.stringify(request.user));
            if (deserializatotionUser === null) {
              throw new Error(
                "IsFollowerStatusRequest could not deserialize user with json:\n" +
                  JSON.stringify(deserializatotionUser)
              );
            }
            let deserializatotionLastItem = null;
            if(request.lastItem == null){
                deserializatotionLastItem = null;
            }else{
                deserializatotionLastItem = Status.fromJson(
                    JSON.stringify(request.lastItem)
                  );
                  if (deserializatotionLastItem === null) {
                    throw new Error(
                      "IsFollowerStatusRequest could not deserialize lastItem with json:\n" +
                        JSON.stringify(deserializatotionLastItem)
                    );
                  }
            }


      
        
            return new loadMoreItemsRequest(
                deserializedToken,
                deserializatotionUser,
                request.pageSize,
                deserializatotionLastItem
            );
          }


}

export class PostStatusRequest{
    authToken: AuthToken;
    newStatus: Status;

    constructor(
        authToken:AuthToken,
        newsStatus:Status
    ){
        this.authToken= authToken;
        this.newStatus=newsStatus;
    }

    static fromJson(request: PostStatusRequest): PostStatusRequest {
        let deserializedToken = AuthToken.fromJson(
          JSON.stringify(request.authToken)
        );
        if (deserializedToken === null) {
          throw new Error(
            "IsFollowerStatusRequest could not deserialize token with json:\n" +
              JSON.stringify(deserializedToken)
          );
        }
        let deserializedStatus = Status.fromJson(
            JSON.stringify(request.newStatus)
          );
    


        return new PostStatusRequest(
            deserializedToken,
            deserializedStatus!
        );
      }



}

export class LoadMoreCyberHumanRequest{
    authToken: AuthToken;
    user: User;
    pageSize: number;
    lastItem: User | null;
    

    constructor(
        authToken:AuthToken,
        user:User,
        pageSize:number,
        lastItem:User|null
        ){
            this.authToken = authToken;
            this.user= user;
            this.pageSize=pageSize;
            this.lastItem= lastItem;
        }

        static fromJson(request: LoadMoreCyberHumanRequest):LoadMoreCyberHumanRequest {
          let deserializedToken = AuthToken.fromJson(
            JSON.stringify(request.authToken)
          );
      
          if (deserializedToken === null) {
            throw new Error(
              "LoadMoreCyberHumanRequest could not deserialize token with json:\n" +
                JSON.stringify(deserializedToken)
            );
          }
          
          console.log("lastUser before deserializatotion:", request.lastItem);
          let deserializatotionLastUser:User|null=null;
          if(request.lastItem!= null){
            deserializatotionLastUser= User.fromJson(JSON.stringify(request.lastItem));
            console.log("deserializatotionLastUser: ", deserializatotionLastUser);
            if (deserializatotionLastUser === null) {
              throw new Error(
                "LoadMoreCyberHumanRequest could not deserialize user with json:\n" +
                  JSON.stringify(deserializatotionLastUser)
              );
            }
          }
        
          

          let  deserializatotionUser = User.fromJson(JSON.stringify(request.user));
          if (deserializatotionUser  === null) {
            throw new Error(
              "LoadMoreCyberHumanRequest could not deserialize user with json:\n" +
                JSON.stringify(deserializatotionUser)
            );
          }
          
          return new LoadMoreCyberHumanRequest(
            deserializedToken,
            deserializatotionUser,
            request.pageSize,
            deserializatotionLastUser
          );
        }


      
}



export class GetIsFollowerStatusRequest{
        authToken: AuthToken;
        user: User;
        selectedUser: User;

        constructor(
        authToken: AuthToken,
        user: User,
        selectedUser: User
        ){
            this.authToken = authToken;
            this.user = user;
            this.selectedUser = selectedUser;

        }

        static fromJson(request: GetIsFollowerStatusRequest):GetIsFollowerStatusRequest {
          let deserializedToken = AuthToken.fromJson(
            JSON.stringify(request.authToken)
          );
      
          if (deserializedToken === null) {
            throw new Error(
              " GetIsFollowerStatusRequest could not deserialize token with json:\n" +
                JSON.stringify(deserializedToken)
            );
          }

          let  deserializatotionUser = User.fromJson(JSON.stringify(request.user));
          if (deserializatotionUser === null) {
            throw new Error(
              " GetIsFollowerStatusRequest could not deserialize user with json:\n" +
                JSON.stringify(deserializatotionUser)
            );
          }

          let deserializatotionSelectedUser = User.fromJson(JSON.stringify(request.selectedUser));
          if (deserializatotionSelectedUser === null) {
            throw new Error(
              " GetIsFollowerStatusRequest could not deserialize user with json:\n" +
                JSON.stringify(deserializatotionSelectedUser)
            );
          }
          
          return new GetIsFollowerStatusRequest(
            deserializedToken,
            deserializatotionUser,
            deserializatotionSelectedUser
          );
        }


}

export class GetAuthTokenandUserRequest{
        authToken: AuthToken;
        user: User;
        constructor(
            authToken:AuthToken,
            user:User){
                this.authToken = authToken;
                this.user= user;
            }
            static fromJson(request: GetAuthTokenandUserRequest): GetAuthTokenandUserRequest {
              let deserializedToken = AuthToken.fromJson(
                JSON.stringify(request.authToken)
              );
          
              if (deserializedToken === null) {
                throw new Error(
                  "GetAuthTokenandUserRequest could not deserialize token with json:\n" +
                    JSON.stringify(deserializedToken)
                );
              }
    
              let  deserializatotionUser = User.fromJson(JSON.stringify(request.user));
              if (deserializatotionUser === null) {
                throw new Error(
                  "GetAuthTokenandUserRequest could not deserialize user with json:\n" +
                    JSON.stringify(deserializatotionUser)
                );
              }
              
              return new GetAuthTokenandUserRequest(
                deserializedToken,
                deserializatotionUser
              );
            }

        
}

export class FollowRequest{
        authToken: AuthToken;
        userToFollow: User;
        loginUser:User;
        constructor(
            authToken: AuthToken,
        userToFollow: User,
        loginUser:User
        ){
            this.authToken=authToken;
            this.userToFollow=userToFollow;
            this.loginUser = loginUser;
        }

        static fromJson(request: FollowRequest): FollowRequest {
          let deserializedToken = AuthToken.fromJson(
            JSON.stringify(request.authToken)
          );
      
          if (deserializedToken === null) {
            throw new Error(
              "FollowRequest could not deserialize token with json:\n" +
                JSON.stringify(deserializedToken)
            );
          }

          let deserializatotionUserToFollow = User.fromJson(JSON.stringify(request.userToFollow));
            if (deserializatotionUserToFollow === null) {
              throw new Error(
                "FollowRequest could not deserialize user with json:\n" +
                  JSON.stringify(deserializatotionUserToFollow)
              );
            }

          let  deserializatotionLoginUser = User.fromJson(JSON.stringify(request.loginUser));
          if (deserializatotionLoginUser === null) {
            throw new Error(
              "FollowRequest could not deserialize user with json:\n" +
                JSON.stringify(deserializatotionLoginUser)
            );
          }
          
          return new FollowRequest(
            deserializedToken,
            deserializatotionUserToFollow,
            deserializatotionLoginUser
          );
        }



}

export class UnfollowRequest{
    authToken: AuthToken;
    userToUnfollow: User;
    loginUser:User;
    constructor(
        authToken: AuthToken,
        userToUnfollow: User,
        loginUser:User
    ){
        this.authToken = authToken;
        this.userToUnfollow = userToUnfollow;
        this.loginUser = loginUser;
    }

    static fromJson(request: UnfollowRequest): UnfollowRequest {
      let deserializedToken = AuthToken.fromJson(
        JSON.stringify(request.authToken)
      );
  
      if (deserializedToken === null) {
        throw new Error(
          "FollowRequest could not deserialize token with json:\n" +
            JSON.stringify(deserializedToken)
        );
      }

      let deserializatotionUserToUnFollow = User.fromJson(JSON.stringify(request.userToUnfollow));
        if (deserializatotionUserToUnFollow === null) {
          throw new Error(
            "FollowRequest could not deserialize user with json:\n" +
              JSON.stringify(deserializatotionUserToUnFollow)
          );
        }

      let  deserializatotionLoginUser = User.fromJson(JSON.stringify(request.loginUser));
      if (deserializatotionLoginUser === null) {
        throw new Error(
          "FollowRequest could not deserialize user with json:\n" +
            JSON.stringify(deserializatotionLoginUser)
        );
      }
      
      return new UnfollowRequest(
        deserializedToken,
        deserializatotionUserToUnFollow,
        deserializatotionLoginUser
      );
    }
}



import { AuthToken,LoginRequest, User,RegisterRequest, GetUserRequest, LogoutRequest } from "tweeter-shared";
import {Buffer} from 'buffer'
import { ServerFacade } from "../net/ServerFacade";

export class UserService{

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise< User | null>{
        let getUserRequest = new GetUserRequest(alias, authToken);
        let getUserResponse = await ServerFacade.instance.getUser(getUserRequest);

        let user= User.fromJson(JSON.stringify(getUserResponse.user));
        if(user == null){
          throw new Error("Invalid alias or authtoken");
      
        }
        else{ 
          return user;
        }

      };

    public async logout (authToken: AuthToken): Promise<void>{

      let logoutRequest = new LogoutRequest(authToken);
      let logoutResponse = await ServerFacade.instance.logout(logoutRequest);
      await new Promise((res) => setTimeout(res, 1000));
    };


    public async login  (
      alias: string,
      password: string
    ): Promise<[User, AuthToken]> {
      let loginRequest = new LoginRequest(alias, password);
      let loginResponse = await ServerFacade.instance.login(loginRequest);
  
     
      let user = User.fromJson(JSON.stringify(loginResponse.user));
      let token = AuthToken.fromJson(JSON.stringify(loginResponse.token));
      if(user === null){
        throw new Error("error with user alias or password");

      }
      if(token == null){
        throw new Error("Login error: login token is wrong");
      }
  
      return [user, token];
    };

    public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: Uint8Array
    ): Promise<[User, AuthToken]> {
      let imageStringBase64: string =
        Buffer.from(userImageBytes).toString("base64");

      let registerRequest = new RegisterRequest(firstName, lastName, alias, password, imageStringBase64);
      let registerResponse = await ServerFacade.instance.register(registerRequest);
      
      let user = User.fromJson(JSON.stringify(registerResponse.user));
      let token = AuthToken.fromJson(JSON.stringify(registerResponse.token));
  
      if (user === null) {
        throw new Error("Invalid registration");
      }

      if(token == null){
        throw new Error("Login error: login token is wrong");
      }
  
      return [user, token];
    };


   



}
import { AuthToken, LoginRequest, AuthenticateResponse, RegisterRequest, GetUserRequest, GetUserResponse, LogoutRequest, LogoutResponse, User} from "tweeter-shared";
import { ServiceFactory } from "./ServiceFactory";

import * as crypto from 'crypto';

export class UserService extends ServiceFactory{

  public async login(
    event: LoginRequest,
  ): Promise<AuthenticateResponse> {
    if (event.username == null) {
      throw new Error("[Bad Request] Missing a username");
    } else if (event.password == null) {
      throw new Error("[Bad Request] Missing a password");
    }
    let user = null;
    let authToken = AuthToken.Generate();
    try {

      let passwordFromDB = await this.createUserProvider().getUserPassword(event.username);
      let hashedPassword = UserService.hashPassword(event.password);
      if(passwordFromDB == hashedPassword){
        user = await this.createUserProvider().getUser(event.username);
      }
      else{
        throw new Error("No userAlias or password does not match");
      }
  
      
    } catch (err) {
      throw new Error("[Bad Request] " + (err as Error).message);
    }
    if(user){
      await this.createAuthTokenProvider().putAuthToken(authToken);
      return new AuthenticateResponse(true, user, authToken);
    
    }
    else{
      throw new Error("First user not found in Database");
    }
  };

  public async register(
    event: RegisterRequest
    ):Promise<AuthenticateResponse>{

    if (event.firstName == null) {
      throw new Error("[Bad Request] Missing a firstName");
    }
    if (event.lastName == null) {
      throw new Error("[Bad Request] Missing a lastName");
    }
    if (event.alias== null) {
      throw new Error("[Bad Request] Missing a alias");
    }
    if (event.password == null) {
      throw new Error("[Bad Request] Missing a password");
    }
    if (event.userImageBytes == null) {
      throw new Error("[Bad Request] Missing a ImageFile");
    }

    if(await this.createUserProvider().getUser(event.alias) != undefined){
      throw new Error("[Bad Request] user existed")
    }


    let fileName = event.alias + "_image";
    let newFileName = await this.createS3Provider().putImage(fileName, event.userImageBytes); 

    let user = new User(event.firstName, event.lastName, event.alias, newFileName);
    let authToken =  AuthToken.Generate()
    let hashedPassword = UserService.hashPassword(event.password);
    console.log(hashedPassword);
    try {
      await this.createUserProvider().putUser(user, hashedPassword);
    } catch (err) {
      throw new Error("[Bad Request] " + (err as Error).message);
    }
    if(user){
      await this.createAuthTokenProvider().putAuthToken(authToken);
      return new AuthenticateResponse(true, user, authToken);
    }

    
    else throw new Error("First user not found in Fake Data.");
  }


  public async getUser (
    event:GetUserRequest
  ): Promise< GetUserResponse>{
    if(event.alias == null){
      throw new Error("[Bad Request] Missing a alias");
    }
    if(event.authToken == null){
      throw new Error("[Bad Request] Missing a authToken");

    }
    
    if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){
    let user = await this.createUserProvider().getUser(event.alias);
    console.log(user);
    
    if(user!= undefined){
      await this.createAuthTokenProvider().putAuthToken(event.authToken);
      return new GetUserResponse(true, null, user);
    }
    else{
      throw new Error("[Not Found] User not found");
    }
  }
  else{
    throw new Error("[Bad Request] Login time expired");
  }

  }

  public async logout (event:LogoutRequest): Promise<LogoutResponse>{
    if (event.authToken == null) {
      throw new Error("[Bad Request] Missing a authToken");
    }
    else{

      await this.createAuthTokenProvider().deleteAuthToken(event.authToken);
      await new Promise((res) => setTimeout(res, 1000));
      return new LogoutResponse(true);

    }
  };

  private static hashPassword(passwordToHash: string): string {
    try {
        const md5Hash = crypto.createHash('md5');
        md5Hash.update(passwordToHash);
        const hashedPassword = md5Hash.digest('hex');
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        return 'FAILED TO HASH';
    }
}



}
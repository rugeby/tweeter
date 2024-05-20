import {AuthenticateResponse, LoginRequest} from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:LoginRequest):Promise<AuthenticateResponse>=>{

        return new UserService(await new DynamoDBDaoFactory()).login(event);


    }



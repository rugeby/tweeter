import {AuthenticateResponse, RegisterRequest} from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:RegisterRequest):Promise<AuthenticateResponse>=>{

        return new UserService(await new DynamoDBDaoFactory()).register(event);


    }



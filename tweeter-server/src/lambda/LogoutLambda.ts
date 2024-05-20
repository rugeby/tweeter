import { LogoutRequest, LogoutResponse} from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDBDaoFactory } from "../DAO/DynamoDBDaoFactory";

export const handler = async (event:LogoutRequest):Promise<LogoutResponse>=>{
    return new UserService(await new DynamoDBDaoFactory()).logout(event);
}

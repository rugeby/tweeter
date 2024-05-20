import { Status, User } from "tweeter-shared";
import { View } from "./Presenter";
import { PageItemPresenter } from "./PageItemPresenter";
import { StatusService } from "../model/service/StatusService";


export interface StatusItemView extends View{
    addItems:(items:Status[])=>void;
    
}

export abstract class StatusItemPresenter extends PageItemPresenter<Status, StatusService>{

    protected createService():StatusService{
        return new StatusService();
    }

}
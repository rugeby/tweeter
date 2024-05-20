import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogOutView extends MessageView{
    navigate:(path:string)=>void;
    clearUserInfo:()=>void;
}



export class LogOutPresenter extends Presenter{
    private service:UserService|null = null;

    public constructor(view:LogOutView){
        super(view);
    }
    public get view(): LogOutView {
      return super.view as LogOutView;
   }

   public get userService(){
    if(this.service == null){
        this.service = new UserService();
    }
    return this.service;
   }




public async logOut (authToken:AuthToken)  {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async()=>{
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigate("/login")
    },
    "log user out");
}
}
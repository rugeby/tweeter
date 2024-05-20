import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView{
    clearPost:()=>void;

}

export class PostStatusPresenter extends Presenter{

  private _userService: StatusService | null = null;


  public constructor(view: PostStatusView) {
    super(view);

  }
  public get view(): PostStatusView {
    return super.view as PostStatusView;
  }

  public get userService() {
    if (this._userService === null) {
      this._userService = new StatusService();
    }

    return this._userService;
  }




    public async submitPost(authToken:AuthToken, post:string, currentUser:User){ 
      this.doFailureReportingOperation(async()=>{
        this.view.displayInfoMessage("Posting status...", 0);
    
          let status = new Status(post, currentUser!, Date.now());
    
          await this.userService.postStatus(authToken!, status);
    
          this.view.clearPost();
          this.view.clearLastInfoMessage();
          this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
    };


}
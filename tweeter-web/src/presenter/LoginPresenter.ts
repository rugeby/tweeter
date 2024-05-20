import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter{
    private service:UserService;
    
    public constructor(view:AuthView){
        super(view);
        this.service = new UserService();
    }

    public get view(): AuthView {
      return super.view as AuthView;
    }

    public async doLogin(alias:string, password:string, originalUrl?: string): Promise<void> {
      this.doLoginRegister(
        ()=>this.service.login(alias, password),

        ()=>{
          if (originalUrl) {
            this.view.navigate(originalUrl);
          } else {
          this.view.navigate("/");
          }
        },
        "log user in"      
        )
        
      };

}
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView{
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;

}

export class RegisterPresenter extends AuthPresenter{
    private service:UserService;

    public constructor(view:RegisterView){
        super(view);
        this.service = new UserService();
    }
    public get view(): RegisterView {
      return super.view as RegisterView;
    }

    public async doRegister(firstName: string,lastName: string, alias: string, password: string, imageBytes: Uint8Array){
      this.doLoginRegister(
        ()=>this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes
        ),
        ()=>this.view.navigate("/"),
        "register user"
      )  
    
      };


      public async handleImageFile(file: File | undefined) {
        if (file) {
          this.view.setImageUrl(URL.createObjectURL(file));
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this.view.setImageBytes(bytes);
          };
          reader.readAsDataURL(file);
        } else {
          this.view.setImageUrl("");
          this.view.setImageBytes(new Uint8Array());
        }
      };
}
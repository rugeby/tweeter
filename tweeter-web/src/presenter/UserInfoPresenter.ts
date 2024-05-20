import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView } from "./Presenter";
import { UserPresenter } from "./UserPresenter";

export interface UserInfoView extends MessageView{
    setIsFollower: (isFollower: boolean) => void;
    setFolloweesCount: (count: number) => void;
    setFollowersCount: (count: number) => void;
}

export class UserInfoPresenter extends UserPresenter{
    private service:FollowService;

    public constructor(view:UserInfoView){
        super(view);
        this.service = new FollowService();
    }


    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {

        this.doFailureReportingOperation(
          async()=>{
            if (currentUser === displayedUser) {
              this.view.setIsFollower(false);
            } else {
              this.view.setIsFollower(
                await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
              );
            }

          },
          "determine follower status" 
        );
      };

      public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => {
          this.view.setFolloweesCount(
            await this.service.getFolloweesCount(authToken, displayedUser));
        }, `get followees count`);
      };

      public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => {
          this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
        }, `get followers count`);
      }


      public async followDisplayedUser(authToken: AuthToken, displayedUser: User, loginUser:User): Promise<void> {

        this.doDisplayUser(
          `Adding ${displayedUser!.name} to followers...`,
          0,
          () => this.service.follow(authToken!, displayedUser!, loginUser!),
          true,
          `follow user`
        );
      };
    
    
      public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User, loginUser:User): Promise<void>{
    
        this.doDisplayUser(
          `Removing ${displayedUser!.name} from followers...`,
           0,
          () => this.service.unfollow(authToken!, displayedUser!, loginUser!),
          false,
          `unfollow user`
        );
      };



}
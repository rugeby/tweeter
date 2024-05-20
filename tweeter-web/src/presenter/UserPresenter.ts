import { MessageView, Presenter } from "./Presenter";



export interface UserView extends MessageView {
    setIsFollower: (isFollower: boolean) => void;
    setFollowersCount: (followersCount: number) => void;
    setFolloweesCount: (followeesCount: number) => void;
}


export abstract class UserPresenter extends Presenter{
    public constructor(view: UserView) {
        super(view);
    }



    public get view(): UserView {
        return super.view as UserView;
    }

    protected doDisplayUser(
        infoMessage : string,
        duration: number,
        doAction: () => Promise<[followersCount: number, followeesCount: number]>,
        isFollower: boolean,
        errorString: string
    ){
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage(infoMessage,duration);
            let [followersCount, followeesCount] = await doAction();
            this.view.clearLastInfoMessage();
            this.view.setIsFollower(isFollower);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        }, errorString);
    }



}
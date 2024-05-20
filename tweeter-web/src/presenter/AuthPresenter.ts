import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";


export interface AuthView extends View{
    updateUserInfo: (user: User, authToken: AuthToken) => void;
    navigate: (path: string) => void;
}
export abstract class AuthPresenter extends Presenter{
    public constructor(view: AuthView) {
        super(view);

    }

    public get view(): AuthView {
        return super.view as AuthView;
    }

    protected doLoginRegister(
        getAuthResult: () => Promise<[User, AuthToken]>,
        navigate: () => void,
        errorString: string,
    ) {
        this.doFailureReportingOperation(async () => {

            let [user, authToken] = await getAuthResult();
            this.view.updateUserInfo(user, authToken);
            navigate();

        }, errorString);


    }
}
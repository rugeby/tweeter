import useToastListener from "../toaster/ToastListenerHook";
import UserInfoHook from "./UserInfoHook";
import { useState } from "react";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";


const userNavigationHook = () =>{
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = UserInfoHook();
    //replace userinfo hook

    const listener:UserNavigationView= {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage:displayErrorMessage,
    }
    const [presenter] = useState(new UserNavigationPresenter(listener));

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(event.target.toString(),currentUser!, authToken!);
      };
    
     

      return {navigateToUser}; 
      


}
export default userNavigationHook;
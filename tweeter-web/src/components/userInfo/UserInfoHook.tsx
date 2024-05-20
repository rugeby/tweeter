import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const UserInfoHook = () => useContext(UserInfoContext);
export default UserInfoHook;
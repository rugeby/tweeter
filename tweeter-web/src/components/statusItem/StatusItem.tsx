import { Link } from "react-router-dom";
import { Status, User } from "tweeter-shared";
import Post from "./Post";
import userNavigationHook from "../userInfo/UserNavigationHook";

interface Props{
  value:User;
  status:Status;
}


const StatusItem = (props: Props)=>{
  const {navigateToUser} = userNavigationHook();


      return(
        <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={props.value.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {props.value.firstName} {props.value.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={props.value.alias}
                  onClick={(event) => navigateToUser(event)}
                >
                  {props.value.alias}
                </Link>
              </h2>
      
              {props.status.formattedDate}
              <br />
              <Post status ={props.status} />
            </div>
          </div>
        </div>
      </div>

      );

   
}


export default StatusItem;
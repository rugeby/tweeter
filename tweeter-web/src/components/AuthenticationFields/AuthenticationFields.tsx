

import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";



interface Props {
    isBottom:boolean;
    onChangeAlias: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePassword:(event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  


const  AuthenticationFields = (props: Props)=> {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");

    return(

        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            aria-label="alias"
            placeholder="name@example.com"
            onChange={props.onChangeAlias}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className={`form-floating ${props.isBottom ? "mb-3" : ""}`}>
          <input
            type="password"
            className={`form-control ${props.isBottom ? "bottom" : ""}`}
            id="passwordInput"
            aria-label="password"
            placeholder="Password"
            onChange={props.onChangePassword}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>

    )
  
  
  
  
  



};

export default AuthenticationFields;
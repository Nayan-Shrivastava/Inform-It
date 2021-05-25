import Button from "@material-ui/core/Button";
import React from 'react';
import { useHistory } from "react-router-dom";

export default function Logout() {
    const history = useHistory();
    const handleOnClick = () =>{
        localStorage.clear("token");
        //console.log("token logout ", localStorage.getItem("token"));
        history.push({ pathname: "/login" });

    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={handleOnClick}
        style={{
          marginLeft: "85%",
          border: "1px solid white",
          textTransform: "unset",
        fontSize: "16px",
        
          
        }}

      >
        Logout
      </Button>
    );
}


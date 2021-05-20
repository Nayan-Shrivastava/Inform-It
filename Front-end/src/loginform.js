import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import { useState } from "react";
import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import './login.css'
//import Template from "./template";
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
function Loginform(props) {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [string, setString] = useState("");
  const history = useHistory();
  const handleOnError = (string) => {
    setString(string);
  };

  const handleOnLogin = () => history.push({ pathname: "/" });
  const handleOnSignup = () => history.push({ pathname: "/signupform" });
  const signupHandler = (e) => {
    handleOnSignup();
  };
  const loginHandler = (e) => {
    e.preventDefault();
    console.log(userName);
    console.log(password);
    const ob = { username: userName, password: password };
    axios
      .post("http://localhost:8000/api/users/login/", ob)
      .then(function (response) {
        // handle success
        if ("error" in response.data) {
          // console.log(response);
          const string = response.data.error;
          console.log("string ", string);
          handleOnError(string);
        } else {
          //console.log(response);
          localStorage.setItem('token',response.data.token)
          handleOnLogin();
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        //console.log("purva");
      });
  };
  return (
    <form>
      <div>
        <div
          style={{
            marginRight: "10%",
            marginLeft: "70%",
            marginBottom: "80%",
            marginTop: "55%",
            width: "100%",
          }}
        >
          <FormLabel for="userName">
            <b>Username : </b>
          </FormLabel>
          <Input
            style={{ borderStyle: "inset", borderRadius: "12px" }}
            color="secondary"
            type="text"
            id="userName"
            name="userName"
            required="true"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          <br />
          <FormLabel for="password">
            <b>Password : </b>
          </FormLabel>
          <Input
            style={{ borderStyle: "inset", borderRadius: "12px" }}
            color="secondary"
            type="password"
            id="password"
            name="password"
            required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          <br></br>
          {string !== undefined && <p>{string}</p>}
          <br />
          <br />
          <Button
            className={classes.heroButtons}
            variant="contained"
            color="primary"
            style={{ height: "8%", width: "25%", marginLeft: "32%" }}
            onClick={loginHandler}
          >
            Login
          </Button>
          <Button
            className={classes.heroButtons}
            variant="outlined"
            color="primary"
            style={{ height: "8%", width: "25%", marginLeft: "3%" }}
            onClick={signupHandler}
          >
            SignUp
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Loginform;

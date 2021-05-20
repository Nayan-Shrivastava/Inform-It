import FormLabel from "@material-ui/core/FormLabel";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import { useState } from "react";
import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
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
function Signupform() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const history = useHistory();
  const handleOnSignup = () => {
    console.log("hii");
    history.push({ pathname: "/login" });
  };
  const registerHandler = (e) => {
    e.preventDefault();
    const ob = {
      name: name,
      username: userName,
      email: email,
      password: password,
      age: age,
      mobile_number: mobileNumber,
    };
    console.log(ob);
    axios
      .post("http://localhost:8000/api/users/create_user/", ob)
      .then(function (response) {
        // handle success
        console.log(response);
        handleOnSignup();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <AnnouncementIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Inform-it
          </Typography>
        </Toolbar>
      </AppBar>
      <form>
        <Typography className={classes.heroContent} variant="h3" align="center">
          Signup Form
        </Typography>

        <Typography className="form-control" style={{ marginTop: "4%" }}>
          <div
            style={{
              marginLeft: "35%",
              marginRight: "50%",
              boxShadow: "1px 1px 2px 3px rgba(0,0,0,0.4)",
              width: "30%",
              border: "1px ",
              paddingTop: "10px",
              borderRadius: "10px",
              marginBottom: "10%",
            }}
          >
            <div style={{ marginLeft: "26%", marginTop: "8%" }}>
              <FormLabel for="name">
                <b>Name : </b>
              </FormLabel>
              <br />
              <Input
                style={{
                  marginLeft: "auto",
                  borderStyle: "inset",
                  borderRadius: "12px",
                }}
                color="secondary"
                type="text"
                placeholder="  Enter Name"
                id="name"
                name="name"
                required="true"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <br />
              <FormLabel for="userName">
                <b>Username : </b>
              </FormLabel>
              <br />
              <Input
                style={{
                  marginLeft: "auto",
                  borderStyle: "inset",
                  borderRadius: "12px",
                }}
                color="secondary"
                type="text"
                placeholder="  Enter Username"
                id="userName"
                name="userName"
                required="true"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <br />
              <br />
              <FormLabel for="email">
                <b>Email : </b>
              </FormLabel>
              <br />
              <Input
                style={{
                  marginLeft: "auto%",
                  borderStyle: "inset",
                  borderRadius: "12px",
                }}
                color="secondary"
                type="text"
                placeholder="  Enter Email"
                id="email"
                name="email"
                required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <br />
              <FormLabel for="password">
                <b>Password : </b>
              </FormLabel>
              <br />
              <Input
                style={{
                  marginLeft: "auto",
                  borderStyle: "inset",
                  borderRadius: "12px",
                }}
                color="secondary"
                type="password"
                placeholder="  Enter Password"
                id="password"
                name="password"
                required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <br />
              <FormLabel for="age">
                <b>Age : </b>
              </FormLabel>
              <br />
              <Input
                style={{
                  marginLeft: "auto%",
                  borderStyle: "inset",
                  borderRadius: "12px",
                }}
                color="secondary"
                type="text"
                placeholder="  Enter Age"
                id="age"
                name="age"
                required="true"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <br />
              <br />
              <FormLabel for="mobileNumber">
                <b>Mobile Number : </b>
              </FormLabel>
              <br />
              <Input
                style={{ borderStyle: "inset", borderRadius: "12px" }}
                color="secondary"
                type="text"
                placeholder="  Enter Mobile Number"
                id="mobileNumber"
                name="mobileNumber"
                required="true"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <br />
              <br />
              <Button
                className={classes.heroButtons}
                variant="contained"
                color="primary"
                size="small"
                onClick={registerHandler}
                style={{ marginLeft: "14%", marginBottom: "10%" }}
              >
                Register
              </Button>
            </div>
          </div>
        </Typography>
      </form>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Hey! Friendly Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Welcome to our Project Page. We're sorry for any inconvenience! It's
          still in development ¯\_(ツ)_/¯
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}

export default Signupform;

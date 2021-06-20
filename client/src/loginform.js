import validator from "validator";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import { useState } from "react";
import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import clsx from "clsx";
import "./login.css";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
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
export default function Loginform(props) {
  const classes = useStyles();
  //for login form
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [string, setString] = useState("");
  const history = useHistory();
  //for signup form
  const [open, setOpen] = useState("");
  const [regName, setRegName] = useState("");
  const [regUserName, setRegUserName] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");
  const [invalidMobile, setInvalidMobile] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [invalidEmail2, setInvalidEmail2] = useState("");
  const [invalidName, setInvalidName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const handleClickShowPassword = () => {
    setShowPwd(!showPwd);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  function validEmail(e) {
    const regex = RegExp(
      /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
    );

    if (!regex.test(e)) {
      setInvalidEmail2("Please enter a valid email.");
    } else {
      setInvalidEmail2("");
      setEmail(e);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleOnSignup = () => {
    history.push({ pathname: "/login" });
  };
  const handleOnError = (string) => {
    setString(string);
  };
  const handleOnCancel = () => {
    setOpen(false);
    setInvalidMessage("");
    setInvalidMobile("");
    setRegName("");
    setRegUserName("");
    setRegPassword("");
    setAge("");
    setMobileNumber("");
    setInvalidEmail("");
    setInvalidName("");
    setInvalidEmail2("");
  };
  const handleOnLogin = () => history.push({ pathname: "/" });

  const registerHandler = (e) => {
    e.preventDefault();
    setInvalidName("");
    setInvalidEmail("");
    setInvalidMobile("");
    setInvalidMessage("");
    const ob = {
      name: regName,
      username: regUserName,
      email: email,
      password: regPassword,
      age: age,
      mobile_number: mobileNumber,
    };

    //console.log(ob);
    if (
      regName.trim() === "" ||
      regUserName.trim() === "" ||
      regPassword.trim() === "" ||
      email.trim() === ""
    ) {
      setInvalidMessage("Please fill out all the required fields.");
    } else {
      setInvalidMessage("");
      if (mobileNumber.trim().length !== 10 && mobileNumber.length !== 0) {
        setInvalidMobile("Please enter a valid mobile number.");
      } else if (invalidEmail2 !== "") {
        setInvalidMobile("");
        console.log("138 : ");
      } else {
        setInvalidEmail2("");
        axios
          .post("/api/users/create_user/", ob)
          .then(function (response) {
            // handle success
            if ("error" in response.data) {
              if (response.data.error === "email exists") {
                setInvalidEmail(
                  `An account with ${email}  already exists.\nPlease try a different Email Address.`
                );
              } else {
                setInvalidEmail("");

                if (response.data.error === "username exists") {
                  setInvalidName(
                    `An account with ${userName}  already exists.\nPlease try a different Username.`
                  );
                } else {
                  setInvalidName("");
                }
              }
            } else {
              console.log(response);
              handleOnSignup();
              setOpen(false);
              setInvalidMessage("");
              setInvalidMobile("");
              setRegName("");
              setRegUserName("");
              setRegPassword("");
              setAge("");
              setMobileNumber("");
              setInvalidEmail("");
              setInvalidName("");
              setInvalidEmail2("");
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
      }
    }
  };
  const loginHandler = (e) => {
    e.preventDefault();
    console.log(userName);
    console.log(password);
    const ob = { username: userName, password: password };
    axios
      .post("/api/users/login/", ob)
      .then(function (response) {
        // handle success
        if ("error" in response.data) {
          //console.log("if ",response);
          const string = response.data.error;
          console.log("string ", string);
          handleOnError(string);
        } else {
          // console.log("else ",response);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
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
      <Grid>
        <Grid item>
          <FormLabel for="userName">
            <b>Username : </b>
          </FormLabel>
          <Input
            style={{
              borderStyle: "inset",
              borderRadius: "12px",
              marginLeft: "10px",
            }}
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
            style={{
              borderStyle: "inset",
              borderRadius: "12px",
              marginLeft: "10px",
            }}
            color="secondary"
            type="password"
            id="password"
            name="password"
            required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          {string !== undefined && <p style={{ color: "red" }}>{string}</p>}
          <br />
        </Grid>
        <Grid item>
          <Button
            className={classes.heroButtons}
            variant="contained"
            color="primary"
            style={{ height: "8%", width: "25%", marginLeft: "25%" }}
            onClick={loginHandler}
          >
            Login
          </Button>
          <Button
            className={classes.heroButtons}
            variant="outlined"
            color="primary"
            style={{ height: "8%", width: "25%", marginLeft: "3%" }}
            onClick={handleClickOpen}
          >
            SignUp
          </Button>
        </Grid>
        <Dialog
          open={open}
          onClose={registerHandler}
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Signup Form : </DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Your Details : </DialogContentText>
            <TextField
              autoFocus
              variant="outlined"
              margin="dense"
              id="Name"
              label="Name"
              type="text"
              fullWidth
              required
              onChange={(e) => setRegName(e.target.value)}
            />
            <TextField
              variant="outlined"
              autoFocus
              margin="dense"
              id="regUserName"
              label="Username"
              type="text"
              fullWidth
              required
              onChange={(e) => setRegUserName(e.target.value)}
            />
            {invalidName !== undefined && (
              <p style={{ color: "red" }}>{invalidName}</p>
            )}
           
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              autoFocus
              fullWidth
              required
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                variant="outlined"
                id="outlined-adornment-password"
                type={showPwd ? "text" : "password"}
                onChange={(e) => setRegPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPwd ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={80}
              />
            </FormControl>
            <TextField
              variant="outlined"
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              fullWidth
              required
              onChange={(e) => validEmail(e.target.value)}
            />
            {invalidEmail !== undefined && (
              <p style={{ color: "red" }}>{invalidEmail}</p>
            )}
            {invalidEmail2 !== undefined && (
              <p style={{ color: "red" }}>{invalidEmail2}</p>
            )}
            <TextField
              variant="outlined"
              autoFocus
              margin="dense"
              id="age"
              label="Age"
              type="text"
              fullWidth
              onChange={(e) => setAge(e.target.value)}
            />
            <TextField
              variant="outlined"
              autoFocus
              margin="dense"
              id="mobileNumber"
              label="Mobile Number"
              type="text"
              fullWidth
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            {invalidMobile !== undefined && (
              <p style={{ color: "red" }}>{invalidMobile}</p>
            )}
            {invalidMessage !== undefined && (
              <p style={{ color: "red" }}>{invalidMessage}</p>
            )}
          </DialogContent>
          <br />
          <br />
          <DialogActions>
            <Button onClick={handleOnCancel} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={registerHandler}
              color="primary"
              variant="contained"
            >
              Register
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </form>
  );
}

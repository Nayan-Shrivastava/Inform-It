import React from "react";
import AppBar from "@material-ui/core/AppBar";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Loginform from "./loginform";
import "./login.css";
import { Grid } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  icon: {
     marginRight: theme.spacing(2),
    //marginLeft: -15,
    maxWidth: 35,
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

export default function Login() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <img
            src="./../assets/images/logo.png"
            alt="logo"
            className={classes.icon}
          />
          {/* <AnnouncementIcon className={classes.icon} /> */}
          <Typography variant="h6" color="inherit" noWrap>
            Inform-it
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Grid container spacing={2} justify="space-evenly">
          <Grid item style={{ marginTop: "5%" }}>
            <img
              src="./../assets/images/login.png"
              alt="study"
              style={{ maxWidth: "100%" }}
            ></img>
          </Grid>
          <Grid
            style={{
              marginTop: "15%",
            }}
          >
            <Loginform />
          </Grid>
        </Grid>
      </main>
      {/* Footer */}
      <footer className={classes.footer} style={{ marginTop: "20%" }}>
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

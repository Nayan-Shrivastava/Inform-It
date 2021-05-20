import React from "react";
import AppBar from "@material-ui/core/AppBar";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Loginform from "./loginform";
import "./login.css";
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

export default function Login() {
  const classes = useStyles();

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
      <main>
        <Box className={"outerContainer"} display="flex">
          <div className={"imageDiv"}>
            <img src="./../assets/images/login.png" alt="study"></img>
          </div>
          <Loginform />
        </Box>
      </main>
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

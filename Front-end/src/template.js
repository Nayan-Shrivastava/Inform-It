import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

const images = ["p.png"];
export default function Template() {
  const classes = useStyles();
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const handleOnTokenNotFound = () => {
    history.push({ pathname: "/login" });
  };
  //console.log("token ", localStorage.getItem("token"));
  if (localStorage.getItem("token") === null) {
    handleOnTokenNotFound();
  }
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const ob = {};
  useEffect(() => {
    axios
      .post("http://localhost:8000/api/users/get-all-batches", ob, axiosConfig)
      .then(function (response) {
        //handle Success
        if ("error" in response.data) {
          // console.log(response);
          handleOnTokenNotFound();
        } else {
          console.log(response.data);
         // console.log("hello ");
          setCards(response.data.arrbatches);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [])

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
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Your Batches
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Here are All Your Batches.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Add Batches
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map(({ index, name }) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.index}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={`./../assets/images/${images[0]}`}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {name}
                    </Typography>
                    <Typography>Some details about this batch.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
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

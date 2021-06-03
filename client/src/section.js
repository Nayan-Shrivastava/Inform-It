import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import Card from "@material-ui/core/Card";
import Logout from "./logout";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
const images = ["section.png"];
export default function Section(props) {
  const classes = useStyles();
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [name, setName] = useState("");
  const location = useLocation();
  //for create section
  const [open, setOpen] = useState(false);

  const [invalidMessage, setInvalidMessage] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  function handleOnCard(id) {
    history.push({ pathname: "/notice", state: id });
  }
  const handleOnTokenNotFound = () => {
    history.push({ pathname: "/login" });
  };
  if (localStorage.getItem("token") === null) {
    handleOnTokenNotFound();
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const handleCancel = () => {
    setOpen(false);
    setSectionName("");
    setSectionDescription("");
    setInvalidMessage("");
  };
  const handleOnClose = (e) => {
    e.preventDefault();
    const ob = {batchId: location.state, name: sectionName, description: sectionDescription  };
    console.log(ob);
    if (sectionName === "") {
      setInvalidMessage("*Please fill out this field");
    } else {
      axios
        .post("/api/batches/create-section", ob, axiosConfig)
        .then(function (response) {
          //handle Success
          // console.log("hi", response);
          console.log(response);
          if ("error" in response.data) {
            handleOnTokenNotFound();
          } else {
            console.log("sahi h", response.data);
            setInvalidMessage("");
            setOpen(false);
            window.location.reload(false);
          }
        })
        .catch(function (error) {
          // handle error
          console.log("hii ", error);
        });
    }
  };
  useEffect(() => {
    console.log(location.state);

    axios
      .post(
        "/api/batches/get-all-sections",
        { batchId: location.state },
        axiosConfig
      )
      .then(function (response) {
        //handle Success
        if ("error" in response.data) {
          console.log(response);
          handleOnTokenNotFound();
        } else {
          //console.log("hii", response);
          setCards(response.data.arrsections);
          setName(response.data.name);

          // console.log("hello ");
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Grid container spacing={2} justify="space-between">
          <Grid item>
            <Toolbar>
              <AnnouncementIcon className={classes.icon} />
              <Typography variant="h6" color="inherit">
                Inform-it
              </Typography>
            </Toolbar>
          </Grid>
          <Grid item>
            <Logout />
          </Grid>
        </Grid>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {name}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Here are All Your Sections.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    Create Section
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleOnClose}
                    fullWidth
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Create a Section :{" "}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Enter Section Details :{" "}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="sectionName"
                        label="Section Name"
                        type="text"
                        fullWidth
                        required
                        onChange={(e) => setSectionName(e.target.value)}
                      />
                      {invalidMessage !== undefined && (
                        <p style={{ color: "red" }}>{invalidMessage}</p>
                      )}
                      <TextField
                        autoFocus
                        multiline="true"
                        margin="dense"
                        id="sectionDescription"
                        label="Description"
                        type="text"
                        fullWidth
                        onChange={(e) => setSectionDescription(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleOnClose} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map(
              ({ index, name, description, createdAt, superAdmin, _id }) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    className={classes.index}
                    style={{ minHeight: "400px", maxHeight: "400px" }}
                    onClick={() => {
                      handleOnCard(_id);
                    }}
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={`./../assets/images/${images[0]}`}
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {name}
                      </Typography>
                      <Typography>
                        {description.length > 100 &&
                          `${description.substring(0, 100)}...`}

                        {description.length <= 100 && `${description}`}
                      </Typography>
                      <br />
                      <Typography>
                        Created On : {createdAt.slice(0, 10)}
                      </Typography>
                      {/* <Typography>Created By : {createdBy}</Typography> */}
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </main>
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

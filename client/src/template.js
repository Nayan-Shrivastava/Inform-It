import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Logout from "./logout";
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

const images = ["p.png"];
export default function Template() {
  const classes = useStyles();
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [invalidBatch, setInvalidBatch] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batchDescription, setBatchDescription] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleOnTokenNotFound = () => {
    history.push({ pathname: "/login" });
  };
  function handleOnCard(id) {
    history.push({ pathname: "/section", state: id });
  }
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
  const handleCancel = () => {
    setOpen(false);
    setOpen2(false);
    setInvalidBatch("");
    setBatchId("");
    setBatchName("");
    setBatchDescription("");
  };
  const handleCreateClose = (e) => {
    e.preventDefault();
    const ob = { name: batchName, description: batchDescription };
    console.log(ob);
    if (batchName === "") {
      setInvalidBatch("*Please fill out this field");
    } else {
      axios
        .post("/api/users/create-batch", ob, axiosConfig)
        .then(function (response) {
          //handle Success
          // console.log("hi", response);
          console.log(response);
          if ("error" in response.data) {
            handleOnTokenNotFound();
          } else {
            console.log("sahi h", response.data);
            setInvalidBatch("");
            setOpen2(false);
            window.location.reload(false);
          }
        })
        .catch(function (error) {
          // handle error
          console.log("hii ", error);
        });
    }
  };
  const handleClose = (e) => {
    e.preventDefault();

    const ob = { batchId: batchId };

    axios
      .post("/api/users/add-batch", ob, axiosConfig)
      .then(function (response) {
        //handle Success
        // console.log("hi", response);
        if ("error" in response.data) {
          console.log(response);
          if (response.data.error === "batch not found") {
            //console.log("batch not found");
            if (batchId === "") {
              setInvalidBatch("*Please fill out this field");
            } else {
              setInvalidBatch("*Invalid Batch Id");
            }
          } else {
            console.log("some other error");
            handleOnTokenNotFound();
          }
        } else {
          console.log("sahi h", response.data);
          setInvalidBatch("");
          setOpen(false);

          window.location.reload(false);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  const ob = {};
  useEffect(() => {
    axios
      .post("/api/users/get-all-batches", ob, axiosConfig)
      .then(function (response) {
        //handle Success
        if ("error" in response.data) {
          console.log(response);
          handleOnTokenNotFound();
        } else {
          //console.log(response.data);
          // console.log("hello ");
          setCards(response.data.arrbatches);
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    Add Batch
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Join a Batch :{" "}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>Enter Batch Id : </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="Batch Id"
                        label="Batch Id"
                        type="text"
                        fullWidth
                        required
                        onChange={(e) => setBatchId(e.target.value)}
                      />
                      {invalidBatch !== undefined && (
                        <p style={{ color: "red" }}>{invalidBatch}</p>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleClose} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClickOpen2}
                  >
                    Create Batch
                  </Button>
                  <Dialog
                    open={open2}
                    onClose={handleCreateClose}
                    fullWidth
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Create a Batch :{" "}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Enter Batch Details :{" "}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="Batch Name"
                        label="Batch Name"
                        type="text"
                        fullWidth
                        required
                        onChange={(e) => setBatchName(e.target.value)}
                      />
                      {invalidBatch !== undefined && (
                        <p style={{ color: "red" }}>{invalidBatch}</p>
                      )}
                      <TextField
                        autoFocus
                        multiline="true"
                        margin="dense"
                        id="Description"
                        label="Description"
                        type="text"
                        fullWidth
                        onChange={(e) => setBatchDescription(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateClose} color="primary">
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
              ({
                index,
                name,
                description,
                createdAt,
                superAdminName,
                _id,
              }) => (
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
                      <Typography>Created By : {superAdminName}</Typography>
                      <Typography>
                        Batch Id : <br />
                        {_id}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
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

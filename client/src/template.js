import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GitHubIcon from "@material-ui/icons/GitHub";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
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
  const [updateOpen, setUpdateOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  if (user === undefined) {
    handleOnTokenNotFound();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleOnTokenNotFound = () => {
    history.push({ pathname: "/login" });
  };
  function handleOnCard(id, superAdmin, adminId) {
    history.push({ pathname: "/section", state: { id, superAdmin, adminId } });
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
  function handleUpdateOpen() {
    setUpdateOpen(true);
  }
  function handleOnUpdatePop(upname, updes, upid) {
    setBatchName(upname);
    setBatchDescription(updes);
    setBatchId(upid);
  }
  function handleOnUpdate() {
    const ob = {
      batchId: batchId,
      name: batchName,
      description: batchDescription,
    };
    if (batchName === "") {
      setInvalidBatch("*Please fill out this field");
    } else {
      axios
        .post("/api/batches/update-batch", ob, axiosConfig)
        .then(function (response) {
          //handle Success
          // console.log("hi", response);
          console.log(response);
          if ("error" in response.data) {
            //  handleOnTokenNotFound();
            console.log("galat h bhai ");
          } else {
            console.log("sahi h", response.data);
            handleCancel();
            window.location.reload(false);
          }
        })
        .catch(function (error) {
          // handle error
          console.log("hii ", error);
        });
    }
  }

  function handleOnDelete(id) {
    const ob = { batchId: id };
    axios
      .post("/api/batches/delete-batch", ob, axiosConfig)
      .then(function (response) {
        //handle Success
        // console.log("hi", response);
        console.log(response);
        if ("error" in response.data) {
          //  handleOnTokenNotFound();
          console.log("galat h bhai ");
        } else {
          console.log("sahi h", response.data);
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        // handle error
        console.log("hii ", error);
      });
  }
  const handleCancel = () => {
    setOpen(false);
    setOpen2(false);
    setInvalidBatch("");
    setBatchId("");
    setBatchName("");
    setBatchDescription("");
    setUpdateOpen(false);
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
            handleCancel();
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
          handleCancel();

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
            {/* <AnnouncementIcon className={classes.icon} /> */}
            <Toolbar>
              <img
                src="./../assets/images/logo.png"
                alt="logo"
                className={classes.icon}
              />
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
      <main
        style={{
          // backgroundImage: `url("./../assets/images/background.png")`,
          // background: "linear-gradient(a1c4fd,#c2e9fb)",
          backgroundImage: "linear-gradient(#f5f7fa ,#c3cfe2)",

          backgroundRepeat: "none",
        }}
      >
        {/* Hero unit */}
        <div
          className={classes.heroContent}
          // style={{
          //   backgroundImage: `url("./../assets/images/header.png")`,

          //   backgroundRepeat: "no-repeat",
          //   backgroundSize: "cover",
          // }}
        >
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
        <Dialog
          open={updateOpen}
          onClose={handleOnUpdate}
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update a Batch : </DialogTitle>
          <DialogContent>
            <DialogContentText>Update Batch Details : </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="Batch Name"
              label="Batch Name"
              type="text"
              value={batchName}
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
              value={batchDescription}
              fullWidth
              onChange={(e) => setBatchDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleOnUpdate} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
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
                adminId,
                superAdmin,
              }) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    className={classes.index}
                    style={{
                      minHeight: "450px",
                      maxHeight: "450px",
                      border: " 1px solid #3f51b5",
                    }}
                  >
                    {/* <MoreVertIcon
                      color="primary"
                      fontSize="medium"
                      style={{ position: "right" }}
                    ></MoreVertIcon> */}
                    <CardMedia
                      className={classes.cardMedia}
                      image={`./../assets/images/${images[0]}`}
                      title="Image title"
                      style={{ borderBottom: " 1px solid #3f51b5" }}
                      onClick={() => {
                        handleOnCard(_id, superAdmin, adminId);
                      }}
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
                      <Typography>Created By : {superAdminName}</Typography>
                      {(adminId.includes(user._id) ||
                        user._id === superAdmin) && (
                      <Typography>
                        Batch Id : <br />
                        {_id}
                      </Typography>)}

                      {(adminId.includes(user._id) ||
                        user._id === superAdmin) && (
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                              handleUpdateOpen();
                              handleOnUpdatePop(name, description, _id);
                            }}
                          >
                            Update
                          </Button>

                          {user._id === superAdmin && (
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => {
                                handleOnDelete(_id);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </CardActions>
                      )}
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
          still in development ¯\_(ツ)_/¯.
          <br />
          This project is developed by :
          <a
            href="https://www.linkedin.com/in/purva-joshi-1a49061b4/"
            target="_blank"
          >
            {" "}
            Purva Joshi{", "}
          </a>
          <a
            href="https://www.linkedin.com/in/nayan-shrivastava-b85a091ab"
            target="_blank"
          >
            {" "}
            Nayan Shrivastava{", "}
          </a>
          <a
            href="https://www.linkedin.com/in/juhi-ojha-3831251ab"
            target="_blank"
          >
            {" "}
            Juhi Ojha{", "}
          </a>
          <a
            href="https://www.linkedin.com/in/aasim-akhtar-88a753159"
            target="_blank"
          >
            {" "}
            Aasim Akhtar
          </a>
          {"."}
          <br />
          <GitHubIcon style={{ color: "black" }} />
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}

import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import GitHubIcon from "@material-ui/icons/GitHub";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
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
import CardActions from "@material-ui/core/CardActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Avatar from "@material-ui/core/Avatar";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
    // marginLeft: -15,
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
  //user

  const [updateOpen, setUpdateOpen] = useState(false);
  const [sectionId, setSectionId] = useState("");
  const [invalidSection, setInvalidSection] = useState("");
  //avatar color
  

  const user = JSON.parse(localStorage.getItem("user"));
  if (user === undefined) {
    handleOnTokenNotFound();
  }

  function handleOnCard(id) {
    history.push({
      pathname: "/notice",
      state: {
        id,
        batchId: location.state.id,
        superAdmin: location.state.superAdmin,
        adminId: location.state.adminId,
      },
    });
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
  function handleUpdateOpen() {
    setUpdateOpen(true);
  }
  function handleOnUpdatePop(upname, updes, upid) {
    setSectionName(upname);
    setSectionDescription(updes);
    setSectionId(upid);
  }
  function handleOnUpdate() {
    const ob = {
      sectionId: sectionId,
      name: sectionName,
      description: sectionDescription,
      batchId: location.state.id,
    };
    if (sectionName === "") {
      setInvalidSection("*Please fill out this field");
    } else {
      axios
        .post("/api/sections/update-section", ob, axiosConfig)
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
    const ob = { sectionId: id, batchId: location.state.id };
    axios
      .post("/api/sections/delete-section", ob, axiosConfig)
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
    setSectionName("");
    setSectionDescription("");
    setInvalidMessage("");
    setInvalidSection("");
    setSectionId("");
    setUpdateOpen(false);
    setMembers(false);
  };
  const handleOnClose = (e) => {
    e.preventDefault();
    const ob = {
      batchId: location.state.id,
      name: sectionName,
      description: sectionDescription,
    };
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
  //for members
  const [members, setMembers] = useState(false);
  const [memberList, setMemberList] = useState([]);
  function handleOnMembers() {
    setMembers(true);
  }
  function handleOnAdmin(userId) {
    axios
      .post(
        "/api/batches/make-admin",
        { batchId: location.state.id, newAdmin: userId },
        axiosConfig
      )
      .then(function (response) {
        //handle Success
        if ("error" in response.data) {
          console.log(response);
        } else {
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  function handleOnRemove(userId){
    axios
      .post(
        "/api/batches/remove-user",
        { batchId: location.state.id, removeUserId: userId },
        axiosConfig
      )
      .then(function (response) {
        //handle Success
        if ("error" in response.data) {
          console.log(response);
        } else {
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  useEffect(() => {
    // console.log(location.state);

    axios
      .post(
        "/api/batches/get-all-sections",
        { batchId: location.state.id },
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
          setMemberList(response.data.arrusers);
          // console.log("hello users ",memberList);
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
              <img
                src="./../assets/images/logo.png"
                alt="logo"
                className={classes.icon}
              />
              {/* <AnnouncementIcon className={classes.icon} /> */}
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
          backgroundImage: "linear-gradient(#f5f7fa ,#c3cfe2)",
          // backgroundImage: "linear-gradient(to right, #e0eafc, #cfdef3)",

          backgroundRepeat: "none",
        }}
      >
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
                  {(location.state.adminId.includes(user._id) ||
                    user._id === location.state.superAdmin) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClickOpen}
                    >
                      Create Section
                    </Button>
                  )}
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
                <Grid item>
                  <Button
                    variant="outlined"
                    style={{ border: "2px solid black", height: "36px" }}
                    onClick={handleOnMembers}
                  >
                    Members
                    <PeopleOutlineIcon
                      color="white"
                      style={{ marginLeft: "10px" }}
                    />
                  </Button>
                  <Dialog
                    open={members}
                    onClose={handleCancel}
                    fullWidth
                    aria-labelledby="form-dialog-title"
                  >
                    {/* <DialogTitle id="form-dialog-title">
                      Members
                    </DialogTitle> */}
                    <DialogContent>
                      <List dense className={classes.root}>
                        {memberList.map(
                          ({ index, name, username, userId, isAdmin }) => {
                          
                              var randomColor =  "#" + Math.floor(
                                Math.random() * 16777215
                              ).toString(16);
                            
                            // const labelId = `checkbox-list-secondary-label-${value}`;

                            return (
                              <ListItem key={index} button>
                                <ListItemAvatar>
                                  <Avatar
                                    style={{
                                      backgroundColor: randomColor,
                                    }}
                                  >
                                    {username[0].toUpperCase()}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  // id={labelId}
                                  primary={username}
                                  secondary={name}
                                />

                                <ListItemSecondaryAction>
                                  {isAdmin && (
                                    <Typography
                                      color="primary"
                                      size="small"
                                      variant="outlined"
                                      style={{
                                        border: "1px solid blue",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        padding: "3px",
                                      }}
                                    >
                                      Admin
                                    </Typography>
                                  )}

                                  {(location.state.adminId.includes(user._id) ||
                                    user._id === location.state.superAdmin) && (
                                    <>
                                      <Button
                                        edge="end"
                                        color="primary"
                                        onClick={() => {
                                          handleOnAdmin(userId);
                                        }}
                                      >
                                        <HowToRegIcon />
                                      </Button>
                                      <Button
                                        edge="end"
                                        style={{ color: "red" }}
                                        onClick={() => {
                                          handleOnRemove(userId);
                                        }}
                                      >
                                        <RemoveCircleIcon />
                                      </Button>
                                    </>
                                  )}
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          }
                        )}
                      </List>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCancel} color="primary">
                        Back
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
          <DialogTitle id="form-dialog-title">Update a Section: </DialogTitle>
          <DialogContent>
            <DialogContentText>Update Section Details : </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="Batch Name"
              label="Batch Name"
              type="text"
              value={sectionName}
              fullWidth
              required
              onChange={(e) => setSectionName(e.target.value)}
            />
            {invalidSection !== undefined && (
              <p style={{ color: "red" }}>{invalidSection}</p>
            )}
            <TextField
              autoFocus
              multiline="true"
              margin="dense"
              id="Description"
              label="Description"
              type="text"
              value={sectionDescription}
              fullWidth
              onChange={(e) => setSectionDescription(e.target.value)}
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
            {cards.map(({ index, name, description, createdAt, _id }) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  className={classes.index}
                  style={{
                    minHeight: "400px",
                    maxHeight: "400px",
                    backgroundImage:
                      // "linear-gradient(to right, #e0eafc, #cfdef3)",
                      "linear-gradient()",
                    border: " 1px solid #3f51b5",
                  }}
                >
                  <CardMedia
                    className={classes.cardMedia}
                    image={`./../assets/images/${images[0]}`}
                    title="Image title"
                    style={{ borderBottom: " 1px solid #3f51b5" }}
                    onClick={() => {
                      handleOnCard(_id);
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
                    {/* <Typography>
                        Created On : {createdAt.slice(0, 10)}
                      </Typography> */}
                    {/* <Typography>Created By : {createdBy}</Typography> */}

                    {(location.state.adminId.includes(user._id) ||
                      user._id === location.state.superAdmin) && (
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
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            handleOnDelete(_id);
                          }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
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

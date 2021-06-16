import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import SortIcon from "@material-ui/icons/Sort";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import GitHubIcon from "@material-ui/icons/GitHub";
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
//sort
import EventBusyIcon from "@material-ui/icons/EventBusy";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
//
import "./index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));
const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
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
const images = ["notice.png"];
export default function Section(props) {
  const modules = {
    toolbar: {
      container: [
        ["image"],
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link"],
        ["clean"],
      ],
    },
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
  const classes = useStyles();
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [name, setName] = useState("");
  const location = useLocation();
  //to create notice
  const [open, setOpen] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [body, setBody] = useState("");
  const [by, setBy] = useState("");
  const [priority, setPriority] = useState("");
  const [impLinks, setImpLinks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [open2, setOpen2] = useState(false);
  const [popBody, setPopBody] = useState("");
  const [popHeading, setPopHeading] = useState("");
  const [popSubheading, setPopSubheading] = useState("");
  const [popPriority, setPopPriority] = useState("");
  const [popBy, setPopBy] = useState("");
  const [popLink, setPopLink] = useState([]);
  const [popDead, setPopDead] = useState("");
  //user
  const [updateOpen, setUpdateOpen] = useState(false);
  const [noticeId, setNoticeId] = useState("");
  //sort
  const [anchorEl, setAnchorEl] = useState(null);
  const sortHandleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const sortHandleClose = () => {
    setAnchorEl(null);
  };
  const sortByName = () => {
    setCards(
      cards.sort((a, b) => {
        return a.heading < b.heading ? -1 : 1;
      })
    );
    sortHandleClose();
  };
  const sortByPriority = () => {
    setCards(
      cards.sort((a, b) => {
        return a.priority > b.priority ? -1 : 1;
      })
    );
    sortHandleClose();
  };
  const sortByDeadline = () => {
    setCards(
      cards.sort((a, b) => {
        if (a.deadline === null) {
          return 1;
        }
        if (b.deadline === null) {
          return -1;
        }
        return a.deadline > b.deadline ? -1 : 1;
      })
    );
    sortHandleClose();
  };
  const sortByTime = () => {
    setCards(
      cards.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      })
    );
    sortHandleClose();
  };
  // const [invalidSection, setInvalidSection] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  if (user === undefined) {
    handleOnTokenNotFound();
  }
  // const preventDefault = (event) => event.preventDefault();
  function handlePop(body, heading, subHeading, priority, link, dead, by) {
    setPopBody(body);
    setPopHeading(heading);
    setPopSubheading(subHeading);
    if (priority === 1) {
      setPopPriority("Low");
    }
    if (priority === 2) {
      setPopPriority("Moderate");
    }
    if (priority === 3) {
      setPopPriority("High");
    }
    if (priority === 4) {
      setPopPriority("Very High");
    }

    setPopBy(by);
    setPopLink(link);
    setPopDead(dead);
  }
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleOnClose2 = () => {
    setOpen2(false);
  };

  const handleOnTokenNotFound = () => {
    history.push({ pathname: "/login" });
  };
  if (localStorage.getItem("token") === null) {
    handleOnTokenNotFound();
  }
  //  console.log(localStorage.getItem("token"));
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
  function handleOnUpdatePop(
    upId,
    upHeading,
    upSubHeading,
    upBody,
    upBy,
    upPriority,
    upImpLinks,
    upDeadline
  ) {
    setNoticeId(upId);
    setHeading(upHeading);
    setSubHeading(upSubHeading);
    setBody(upBody);
    setBy(upBy);
    setPriority(upPriority);
    setImpLinks(upImpLinks.join());
    setDeadline(upDeadline);
  }
  function handleOnUpdate() {
    const ob = {
      sectionId: location.state.id,
      noticeId: noticeId,
      batchId: location.state.batchId,
      heading: heading,
      subHeading: subHeading,
      by: by,
      body: body,
      priority: priority,
      impLinks: impLinks,
      deadline: deadline,
    };
    if (heading === "" || body === "") {
      setInvalidMessage("*Please fill out all the required fields");
    } else {
      axios
        .post("/api/notices/update-notice", ob, axiosConfig)
        .then(function (response) {
          //handle Success
          // console.log("hi", response);
          // console.log(response);
          if ("error" in response.data) {
            //  handleOnTokenNotFound();
            console.log("response ", response);
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
    const ob = {
      sectionId: location.state.id,
      batchId: location.state.batchId,
      noticeId: id,
    };
    axios
      .post("/api/notices/delete-notice", ob, axiosConfig)
      .then(function (response) {
        //handle Success
        // console.log("hi", response);
        console.log(response);
        if ("error" in response.data) {
          console.log("", response);
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
    setInvalidMessage("");
    setHeading("");
    setSubHeading("");
    setBody("");
    setPriority("");
    setImpLinks("");
    setDeadline("");
    setBy("");
    setUpdateOpen(false);
  };
  const handleOnClose = (e) => {
    e.preventDefault();
    const ob = {
      heading: heading,
      subHeading: subHeading,
      body: body,
      priority: priority,
      impLinks: impLinks,
      deadline: deadline,
      by: by,
      sectionId: location.state.id,
      batchId: location.state.batchId,
    };
    console.log("hi ", ob);
    console.log("body", body);
    if (heading === "" || body === "") {
      setInvalidMessage("*Please fill out all the required fields");
    } else {
      axios
        .post("/api/sections/create-notice", ob, axiosConfig)
        .then(function (response) {
          console.log(response);

          console.log("sahi h", response.data);
          setInvalidMessage("");
          setOpen(false);
          window.location.reload(false);
        })
        .catch(function (error) {
          // handle error
          console.log("hii ", error);
        });
    }
  };
  useEffect(() => {
    //console.log("hi ", location.state);

    axios
      .post(
        "/api/sections/get-all-notices",
        { sectionId: location.state.id },
        axiosConfig
      )
      .then(function (response) {
        //handle Success
        if ("error" in response.data) {
          console.log(response);
          //handleOnTokenNotFound();
        } else {
          console.log("hii", response);
          setCards(response.data.arrnotices);
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
          backgroundRepeat: "none",
          backgroundImage: "linear-gradient(#f5f7fa ,#c3cfe2)",
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
              Here are All Your Notices.
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
                      Create Notice
                    </Button>
                  )}
                  <Dialog
                    open={open}
                    onClose={handleOnClose}
                    fullWidth
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Create a Notice :{" "}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Enter Notice Details :{" "}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="heading"
                        label="Heading"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={(e) => setHeading(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="subHeading"
                        label="Sub Heading"
                        type="text"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setSubHeading(e.target.value)}
                      />
                      <br />

                      <ReactQuill
                        value={body}
                        theme="snow"
                        placeholder="Body*"
                        modules={modules}
                        required
                        style={{ marginTop: "3px" }}
                        format={formats}
                        onChange={(content) => setBody(content)}
                      />

                      <TextField
                        autoFocus
                        margin="dense"
                        id="by"
                        label="By"
                        type="text"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setBy(e.target.value)}
                      />

                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                        fullWidth
                        style={{ marginTop: "3px" }}
                      >
                        <InputLabel htmlFor="outlined-age-native-simple">
                          Priority
                        </InputLabel>
                        <Select
                          native
                          label="Priority"
                          inputProps={{
                            name: "Priority",
                            id: "outlined-age-native-simple",
                          }}
                          value={priority}
                          variant="outlined"
                          autoFocus
                          margin="dense"
                          id="priority"
                          onChange={(e) => setPriority(e.target.value)}
                        >
                          <option value="" disabled></option>
                          <option value={1}>Low</option>
                          <option value={2}>Moderate</option>
                          <option value={3}>High</option>
                          <option value={4}>Very High</option>
                        </Select>
                      </FormControl>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="impLinks"
                        label="Important Links"
                        type="text"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setImpLinks(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="deadline"
                        label="Deadline"
                        variant="outlined"
                        type="Date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => setDeadline(e.target.value)}
                      />
                      {invalidMessage !== undefined && (
                        <p style={{ color: "red" }}>{invalidMessage}</p>
                      )}
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
                    style={{ border: "2px solid black" }}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={sortHandleClick}
                  >
                    sort by
                    <SortIcon color="white" style={{ marginLeft: "10px" }} />
                  </Button>
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={sortHandleClose}
                  >
                    <StyledMenuItem onClick={sortByName}>
                      <ListItemIcon>
                        <SortByAlphaIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Name" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={sortByPriority}>
                      <ListItemIcon>
                        <PriorityHighIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Priority" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={sortByDeadline}>
                      <ListItemIcon>
                        <EventBusyIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Deadline" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={sortByTime}>
                      <ListItemIcon>
                        <AccessTimeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Time" />
                    </StyledMenuItem>
                  </StyledMenu>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Dialog
          open={open2}
          onClose={handleOnClose2}
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
            <h4 style={{ fontFamily: "cursive" }}>{popHeading}</h4>

            <h5 style={{ textAlign: "center" }}>{popSubheading}</h5>
          </DialogTitle>
          <DialogContent>
            <Typography>Deadline: </Typography>
            <Typography>
              {popDead !== null && (
                <Chip label={popDead.slice(0, 10)} color="secondary" />
              )}
            </Typography>
            <Typography>Priority : {popPriority}</Typography>

            <ReactQuill
              value={popBody}
              readOnly={true}
              theme={"bubble"}
              style={{ marginLeft: " 10%" }}
            />
            <Typography> Notice By: {popBy}</Typography>

            <Typography>
              {popLink !== null && popLink.length !== 0 && `Important Links: `}
              {popLink !== null &&
                popLink.length !== 0 &&
                popLink.map((pop) => (
                  <Typography>
                    <a href={pop} target="_blank">
                      {pop}
                    </a>

                    <br />
                  </Typography>
                ))}
            </Typography>

            {/* <Typography>
              {popDead !== null && `Deadline: ${popDead.slice(0, 10)}`}
            </Typography> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnClose2} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={updateOpen}
          onClose={handleOnUpdate}
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update a Notice: </DialogTitle>
          <DialogContent>
            <DialogContentText>Update Notice Details : </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              value={heading}
              id="heading"
              label="Heading"
              type="text"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setHeading(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              value={subHeading}
              id="subHeading"
              label="Sub Heading"
              type="text"
              variant="outlined"
              fullWidth
              onChange={(e) => setSubHeading(e.target.value)}
            />
            <br />

            <ReactQuill
              value={body}
              theme="snow"
              placeholder="Body*"
              modules={modules}
              required
              style={{ marginTop: "3px" }}
              format={formats}
              onChange={(content) => setBody(content)}
            />

            <TextField
              autoFocus
              value={by}
              margin="dense"
              id="by"
              label="By"
              type="text"
              variant="outlined"
              fullWidth
              onChange={(e) => setBy(e.target.value)}
            />

            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
              style={{ marginTop: "3px" }}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                Priority
              </InputLabel>
              <Select
                native
                label="Priority"
                inputProps={{
                  name: "Priority",
                  id: "outlined-age-native-simple",
                }}
                value={priority}
                variant="outlined"
                autoFocus
                margin="dense"
                id="priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="" disabled></option>
                <option value={1}>Low</option>
                <option value={2}>Moderate</option>
                <option value={3}>High</option>
                <option value={4}>Very High</option>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              value={impLinks}
              margin="dense"
              id="impLinks"
              label="Important Links"
              type="text"
              variant="outlined"
              fullWidth
              onChange={(e) => setImpLinks(e.target.value)}
            />
            <TextField
              autoFocus
              value={deadline}
              margin="dense"
              id="deadline"
              label="Deadline"
              variant="outlined"
              type="Date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setDeadline(e.target.value)}
            />
            {invalidMessage !== undefined && (
              <p style={{ color: "red" }}>{invalidMessage}</p>
            )}
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
                heading,
                body,
                by,
                subHeading,
                createdAt,
                createdByName,
                priority,
                deadline,
                impLinks,
                _id,
              }) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    className={classes.index}
                    style={{
                      minHeight: "470px",
                      maxHeight: "470px",
                      border: " 1px solid #3f51b5",
                    }}
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={`./../assets/images/${images[0]}`}
                      title="Image title"
                      style={{ borderBottom: " 1px solid #3f51b5" }}
                      onClick={() => {
                        handleClickOpen2();
                        handlePop(
                          body,
                          heading,
                          subHeading,
                          priority,
                          impLinks,
                          deadline,
                          by
                        );
                      }}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {heading}
                      </Typography>
                      <Typography>
                        {deadline != null && (
                          <h5>Deadline: {deadline.slice(0, 10)}</h5>
                        )}
                      </Typography>

                      <Typography>
                        {impLinks !== null &&
                          impLinks.length !== 0 &&
                          `Important Links: `}
                        {impLinks !== null &&
                          impLinks.length !== 0 &&
                          impLinks.map((imp) => (
                            <Typography>
                              {/* <Link to={imp}>{imp}</Link> */}
                              <a href={imp} target="_blank">
                                {imp}
                              </a>

                              <br />
                            </Typography>
                          ))}
                      </Typography>

                      <Typography>
                        {(priority === 1 && `Priority: Low`) ||
                          (priority === 2 && `Priority: Moderate`) ||
                          (priority === 3 && `Priority: High`) ||
                          (priority === 4 && `Priority: Very High`)}
                      </Typography>
                      <Typography>Created By : {createdByName}</Typography>
                      <br></br>
                      {(location.state.adminId.includes(user._id) ||
                        user._id === location.state.superAdmin) && (
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                              handleUpdateOpen();
                              handleOnUpdatePop(
                                _id,
                                heading,
                                subHeading,
                                body,
                                by,
                                priority,
                                impLinks,
                                deadline
                              );
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

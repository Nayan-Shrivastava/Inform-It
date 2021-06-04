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
import Link from "@material-ui/core/Link";
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
import "./index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Chip from "@material-ui/core/Chip";

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
  //for create section
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
      sectionId: location.state,
    };
    console.log("hi ", ob);
    console.log("body", body);
    if (heading === "" || body === "") {
      setInvalidMessage("*Please fill out all the required fields");
    } else {
      axios
        .post(
          "/api/sections/create-notice",
          ob,
          axiosConfig
        )
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
    console.log("hi ", location.state);

    axios
      .post(
        "/api/sections/get-all-notices",
        { sectionId: location.state },
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
              Here are All Your Notices.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    Create Notice
                  </Button>
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
                    <Link to={pop}>{pop}</Link>

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
                createdBy,
                priority,
                deadline,
                impLinks,
                _id,
              }) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    className={classes.index}
                    style={{ minHeight: "450px", maxHeight: "450px" }}
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
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={`./../assets/images/${images[0]}`}
                      title="Image title"
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
                              <Link to={imp}>{imp}</Link>

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
                      <Typography>
                        Created On : {createdAt.slice(0, 10)}
                      </Typography>
                      <Typography>
                        Created By : <br />
                        {createdBy}
                      </Typography>
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

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
import "./index.css";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

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
const images = ["p1.png"];
export default function Section(props) {
  const modules = {
    toolbar: {
      
      container: [
        [ "image"],
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

  function handleOnCard(id) {
    console.log(id);
  }
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
    };
    console.log("hi ", ob);
    console.log("body", body);
    if (heading === "") {
      setInvalidMessage("*Please fill out this field");
    } else {
      axios
        .post(
          "http://localhost:8000/api/sections/create-notice",
          ob,
          axiosConfig
        )
        .then(function (response) {
          console.log(response);

          console.log("sahi h", response.data);
          setInvalidMessage("");
          setOpen(false);
          //window.location.reload(false);
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
        "http://localhost:8000/api/sections/get-all-notices",
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
        <Toolbar>
          <AnnouncementIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Inform-it
          </Typography>
          <Logout />
        </Toolbar>
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
                      {/* {invalidMessage !== undefined && (
                        <p style={{ color: "red" }}>{invalidMessage}</p>
                      )} */}
                      <TextField
                        autoFocus
                        margin="dense"
                        id="subHeading"
                        label="Sub Heading"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={(e) => setSubHeading(e.target.value)}
                      />
                      {/* <TextField
                        autoFocus
                        multiline="true"
                        margin="dense"
                        id="body"
                        label="Body"
                        type="text"
                        fullWidth
                        onChange={(e) => setBody(e.target.value)}
                      /> */}
                      <ReactQuill
                        value={body}
                        theme="snow"
                        placeholder = "Body..."
                        modules={modules}
                        format={formats}
                        onChange={(content) => setBody(content)}
                      />
                      <br />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="by"
                        label="By"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={(e) => setBy(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="priority"
                        label="Priority"
                        variant="outlined"
                        type="text"
                        fullWidth
                        required
                        onChange={(e) => setPriority(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="impLinks"
                        label="Important Links"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={(e) => setImpLinks(e.target.value)}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="deadline"
                        label="Deadline"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required
                        onChange={(e) => setDeadline(e.target.value)}
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
              ({
                index,
                heading,
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
                        {heading}
                      </Typography>
                      <Typography>{deadline}</Typography>

                      <Typography>{impLinks}</Typography>
                      <br />
                      <Typography>{priority}</Typography>

                      {/* <Typography>
                        {/* {description.length > 100 &&
                          `${description.substring(0, 100)}...`}

                        {description.length <= 100 && `${description}`} 
                      </Typography> */}
                      <br />
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

import React from "react";
import Login from "./login";
import { Switch, Route} from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Template from "./template";
import Signupform from "./signupform";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Template />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signupform">
          <Signupform />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

import React from "react";
import Login from "./login";
import { Switch, Route} from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Template from "./template";
import Section from "./section";
import Notice from "./notice";

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
        <Route path="/section">
          <Section />
        </Route>
        <Route path="/notice">
          <Notice />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

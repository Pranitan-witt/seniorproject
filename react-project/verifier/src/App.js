import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import Home from "./components/home/home";
import Verifier from "./components/verifier/verifier";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/verifier" component={Verifier} />
        </Switch>
      </Router>
    );
  }
}

export default App;

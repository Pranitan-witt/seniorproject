import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import Home from "./components/home/home";
import Holder from "./components/holder/holder";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/holder" component={Holder} />
        </Switch>
      </Router>
    );
  }
}

export default App;

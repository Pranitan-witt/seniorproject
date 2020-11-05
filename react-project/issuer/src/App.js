import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

// import { Button } from 'reactstrap';

import Home from "./components/home/home";
import Issuer from "./components/issuer/issuer";
// import Contact from './components/contact';

class App extends Component {
  render() {
    return (
      <Router>
        {/* <useRouteMatch */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/issuer" component={Issuer} />
          {/* <Route path='/about' component={About} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;

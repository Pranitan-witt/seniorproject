import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';

// import { Button } from 'reactstrap';

import Home from './components/home/home';
import Holder from './components/holder/holder';
import Contact from './components/contact';

class App extends Component {
  render() {
    return (
    <Router>
      {/* <useRouteMatch */}
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/holder' component={Holder} />
              {/* <Route path='/about' component={About} /> */}
          </Switch>
      </Router>
    );
  }
}

export default App;
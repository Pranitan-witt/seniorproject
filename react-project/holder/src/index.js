import React from 'react';
import ReactDOM, {render} from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Router, Route, Link } from 'react-router-dom';
import { browserHistory } from 'react-router';

ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
    <BrowserRouter>
        <App />
    </BrowserRouter>,
  document.querySelector('#root')
);


reportWebVitals();

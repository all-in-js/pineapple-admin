import * as React from 'react';
import ReactDOM from 'react-dom';
import Fetch from '@all-in-js/fetch-functions-api';
import {
  BrowserRouter as Router
} from "react-router-dom";
import 'antd/dist/antd.less';
import './index.scss';
import App from './app-layout';
import reportWebVitals from './reportWebVitals';

window.API_HOST = process.env.API_HOST || '';
window.$fetch = new Fetch(`${window.API_HOST}/api/functions`);

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

reportWebVitals(console.log);

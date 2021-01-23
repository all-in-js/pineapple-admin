import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router
} from "react-router-dom";
import 'antd/dist/antd.less';
import './index.scss';
import App from './app-layout';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

reportWebVitals(console.log);

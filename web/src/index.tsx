import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router
} from "react-router-dom";
import 'antd/dist/antd.less';
import './index.scss';
import App from './app-layout';
import reportWebVitals from './reportWebVitals';
fetch('//localhost:4000/api/functions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    $fns: ['api/addUser', 'api/userList'],
    $vars: [{
      username: 'aaaaaaaasmin',
      password: 'ass'
    }]
  })
});
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

reportWebVitals(console.log);

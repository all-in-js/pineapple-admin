import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import IndexPage from './pages/index';

function App(props: any) {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="app-header-info">
            <span>菠萝</span>
            <small>v1.0.1</small>
            <p>基于 svg 的图标管理和组件化方案</p>
          </div>
          <div className="app-header-nav">
            <Link to="/" className="app-header-nav-item active">首页</Link>
            <Link to="/" className="app-header-nav-item">项目管理</Link>
            <div className="app-header-nav-item">用户管理</div>
            <div className="app-header-nav-item">使用文档</div>
            <div className="app-header-nav-item">Github</div>
            <div className="app-header-nav-item">EN / ZH</div>
          </div>
        </header>
        <Switch>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

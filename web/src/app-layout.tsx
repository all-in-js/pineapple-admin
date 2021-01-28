import * as React from 'react';
import {
  Switch,
  Route,
  NavLink,
  Redirect,
  useLocation
} from "react-router-dom";
import IndexPage from './pages/index';
import LoginPage from './pages/login';
import ManageProject from './pages/manage-project';
import ManageUser from './pages/manage-user';
import Logo from './assets/imgs/pineapple.svg';

const {
  useEffect,
  useState
} = React;

function LayoutFrame(props: any) {
  const { isLogin } = props;
  return (
    isLogin ?
    null :
    <header className="app-header">
      <div className="app-header-info">
        <img src={ Logo } />
        <span>pineapple</span>
        <small>v1.0.1</small>
        <p>基于 svg 的图标管理和组件化方案</p>
      </div>
      <div className="app-header-nav">
        <NavLink to="/dashboard" className="app-header-nav-item">首页</NavLink>
        <NavLink to="/manage-project" className="app-header-nav-item">项目管理</NavLink>
        <NavLink to="/manage-user" className="app-header-nav-item">用户管理</NavLink>
        <NavLink to="/manage-projhect" className="app-header-nav-item">使用文档</NavLink>
        <div className="app-header-nav-item">Github</div>
        <div className="app-header-nav-item">EN / ZH</div>
      </div>
    </header>
  )
}

function App(props: any) {
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location]);

  return (
    <div className="app">
      <LayoutFrame isLogin={ isLogin } />
      <Switch>
        <Route exact path="/dashboard">
          <IndexPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/manage-project">
          <ManageProject />
        </Route>
        <Route path="/manage-user">
          <ManageUser />
        </Route>
        <Redirect to="/dashboard"></Redirect>
      </Switch>
    </div>
  );
}

export default App;

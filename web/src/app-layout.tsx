import * as React from 'react';
import {
  Switch,
  Route,
  NavLink,
  Redirect,
  useLocation
} from "react-router-dom";
import { Button, Dropdown, Menu } from 'antd';
import IconFont from './components/icon-font';
import LoginPage from './pages/login';
import HomePage from './pages/home-page';
import IconsPage from './pages/icons-page';
import ManageUser from './pages/manage-user';
import Logo from './assets/imgs/pineapple.svg';

const {
  useEffect,
  useState
} = React;

function LayoutFrame(props: any) {
  const { isLogin } = props;
  const content = (
    <Menu>
      <Menu.Item>
        <IconFont name="icon-xiugaimima" />
        修改密码
      </Menu.Item>
      <Menu.Item>
        <IconFont name="icon-info" />
        关于
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Button>退出登录</Button>
      </Menu.Item>
    </Menu>
  );
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
        <NavLink exact to="/" className="app-header-nav-item">图标管理</NavLink>
        <NavLink to="/manage-user" className="app-header-nav-item">用户管理</NavLink>
        <NavLink to="/manage-projhect" className="app-header-nav-item">使用文档</NavLink>
        <a target="_blank" href="https://github.com/all-in-js/pineapple-admin" className="app-header-nav-item">Github</a>
        <div className="app-header-nav-item">EN / ZH</div>
        <Dropdown overlay={content} className="app-header-user-info">
          <span>
            <IconFont name="icon-user1" />
            Admin
            <IconFont name="icon-Icon-KeyboardArrow-Down-Rounded1" />
          </span>
        </Dropdown>
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
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/icons/:alias">
          <IconsPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/manage-user">
          <ManageUser />
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    </div>
  );
}

export default App;

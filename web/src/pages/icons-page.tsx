import * as React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import IconFont from '../components/icon-font';

function IconsPage() {
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <IconFont size="15px" name="icon-shujuyuanwenjian" /> 图标源文件
      </Menu.Item>
      <Menu.Item key="2">
        <IconFont size="15px" name="icon-js" /> 图标数据集
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="icons-page">
      <div className="head">
        <div className="icons-info">
          <IconFont
            className="page-back"
            size="18px"
            name="icon-back" />
          <strong>sss图标库</strong>
          <small>cbg-icns</small>
        </div>
        <div className="icons-ctrls">
          <Button
            className="icons-upload"
            type="primary">
            <IconFont size="20px" name="icon-up-load" />
            上传图标
          </Button>
          <Dropdown overlay={menu}>
            <Button className="icons-download">
              <IconFont size="20px" name="icon-Clouddownload-Outlined" />
              下载资源
              <IconFont size="20px" name="icon-Icon-KeyboardArrow-Down-Rounded1" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="content">
        <div className="left">
        
        </div>
        <div className="right">
  
        </div>
      </div>
    </div>
  );
}

export default IconsPage;
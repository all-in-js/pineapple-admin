import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Dropdown, Menu, Upload } from 'antd';
import IconFont from '../components/icon-font';

function IconsPage(props: any) {
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
  const handleUpload = (info: any) => {
    const fd = new FormData();
    fd.append('svg', info.file);
    fd.append('$fns', 'api/uploadSvg');
    fd.append('$vars', JSON.stringify({
      alias: 'ssasa',
      name: 'sasssssss'
    }));
    fd.append('alias', 'ssasa');
    fetch('/api/functions', {
      method: 'POST',
      body: fd
    });
  }
  return (
    <div className="icons-page">
      <div className="head">
        <div className="icons-info">
          <IconFont
            onClick={() => props.history.goBack()}
            className="page-back"
            size="18px"
            name="icon-back" />
          <strong>sss图标库</strong>
          <small>cbg-icns</small>
        </div>
        <div className="icons-ctrls">
          <Upload
            name="svg"
            accept="svg"
            customRequest={handleUpload}>
            <Button
              className="icons-upload"
              type="primary">
              <IconFont size="20px" name="icon-up-load" />
              上传图标
            </Button>
          </Upload>
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

export default withRouter(IconsPage);
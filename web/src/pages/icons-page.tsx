import * as React from 'react';
import { withRouter } from 'react-router-dom';
import copy from 'clipboard-copy';
import { Button, Dropdown, Menu, message, Upload, Tooltip, Popover } from 'antd';
import IconFont from '../components/icon-font';

const {
  useState,
  useEffect
} = React;

interface ProjInfo {
  name: string;
  alias: string;
  totalMembers: string[];
  [key: string]: string | boolean | number | string[];
}

function IconsPage(props: any) {
  const {
    alias
  } = props.match.params;
  const [svgList, setSvgList] = useState([]);
  const [projInfo, setProjInfo] = useState<ProjInfo>({
    name: '',
    alias: '',
    totalMembers: []
  });
  const [searchForm, setSearchForm] = useState({
    name: '',
    alias,
    pageNo: 1,
    pageSize: 50
  });
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
  const getSvgs = async () => {
    const data = await window.$fetch.combine({
      'api/project': { alias },
      'api/svgList': searchForm
    });

    if (data.length) {
      const [projRes, svgsRes] = data;
      if (projRes.code === 1000) {
        setProjInfo(projRes.data);
      }
      if (svgsRes.code === 1000) {
        setSvgList(svgsRes.data);
      }
    }
  }
  const handleUpload = async (info: any) => {
    const fd = new FormData();
    const name = info.file.name.replace(/\.\w+$/, '');
    fd.append('svg', info.file);
    fd.append('alias', alias);
    fd.append('name', name);
    const { code, msg } = await fetch('/api/v1/upload', {
      method: 'POST',
      body: fd
    }).then((res) => res.json());
    if (code === 1000) {
      message.success(`'${name}' 上传成功`);
      getSvgs();
    } else {
      message.error(msg);
    }
  }
  const handleCopyCode = async (name: string) => {
    const code = `<vue-icon name="${name}"></vue-icon>`;
    await copy(code);
    message.success(`copied! ${code}`);
  }
  useEffect(() => {
    getSvgs();
  }, []);
  return (
    <div className="icons-page">
      <div className="head">
        <div className="icons-info">
          <IconFont
            onClick={() => props.history.goBack()}
            className="page-back"
            size="18px"
            name="icon-back" />
          <strong>{projInfo.name}</strong>
          <small>{projInfo.alias}</small>
          <span className="icons-count">{svgList.length}</span>
        </div>
        <div className="icons-ctrls">
          <Upload
            className="icons-upload-btn"
            multiple
            name="svg"
            accept="svg"
            showUploadList={false}
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
              <IconFont name="icon-Icon-KeyboardArrow-Down-Rounded1" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="content">
        <div className="left">
          {
            svgList.map((svg: any, i: number) => {
              const content = (
                <Menu>
                  <Menu.Item>下载 SVG</Menu.Item>
                  <Menu.Item>下载 PNG</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item>编辑</Menu.Item>
                  <Menu.Item>删除</Menu.Item>
                </Menu>
              );
              return (
                <div
                  key={i}
                  className="svg-item">
                  <i className="iconfont icon-tupian svg-icon"></i>
                  <div className="icon-name nobr">{svg.name}</div>
                  <Dropdown overlay={content}>
                    <i className="iconfont icon-more-vertical icon-ctrls"></i>
                  </Dropdown>
                  <div
                    onClick={() => handleCopyCode(svg.name)}
                    className="copy-icon-code">复制代码</div>
                </div>
              );
            })
          }
        </div>
        <div className="right">
          <div className="title">项目成员 <span className="counter">{projInfo.totalMembers.length}</span></div>
          <div className="memebers">
            {
              projInfo.totalMembers.length ?
              projInfo.totalMembers.map((member: any, i: number) => {
                return (
                  <Tooltip title={member.username} key={i}>
                    <div
                      style={{background: member.imgColor}}
                      className="member-icon">{member.username.slice(0, 1)}</div>
                  </Tooltip>
                );
              }) :
              null
            }
          </div>
          <Button className="invite-member">
            <IconFont size="20px" name="icon-add" />
            添加成员
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(IconsPage);
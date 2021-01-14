import * as React from 'react';
import { Table, Button, Form, Input, Select } from 'antd';

const {
  useState,
  useEffect,
  useRef
} = React;

const { Option } = Select;

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    authType: 0,
    creator: '管理员',
    status: '禁用',
    operate: ''
  },
  {
    key: '2',
    name: '胡彦斌',
    authType: 0,
    creator: '管理员',
    status: '禁用',
    operate: ''
  }
];

const columns = [
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '权限',
    dataIndex: 'authType',
    key: 'authType',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
];

function ManageUser() {
  const winHeight = window.innerHeight;
  const table = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  useEffect(() => {
    const { offsetTop } = table.current as HTMLDivElement;
    setMaxHeight(winHeight - offsetTop - 100);
  });
  return (
    <div
      ref={ table }
      className="manage-user-page">
      <div className="search-content">
        <div className="search-head">
          <b>检索条件</b>
          <div>
            <Button type="text">重置</Button>
            <Button type="primary">检索</Button>
          </div>
        </div>
        <div className="search-fields">
        <Form layout="vertical">
          <Form.Item label="用户名">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="创建人">
            <Input placeholder="请输入创建人" />
          </Form.Item>
          <Form.Item label="状态">
            <Select placeholder="请选择">
              <Option value="0">启用</Option>
              <Option value="1">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
        </div>
      </div>
      <div className="result-content">
        <div className="result-head">
          <span>检索结果：共5条</span>
          <Button type="primary">新建用户</Button>
        </div>
        <Table
          scroll={{ y: maxHeight }}
          className="result-table"
          dataSource={dataSource}
          columns={columns} />
      </div>
    </div>
  );
}

export default ManageUser;
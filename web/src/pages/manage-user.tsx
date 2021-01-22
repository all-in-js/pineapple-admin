import * as React from 'react';
import { Table, Button, Form, Input, Select, Modal, Switch, Radio, message } from 'antd';

const {
  useState,
  useEffect,
  useRef
} = React;

const { Option } = Select;

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '角色',
    dataIndex: 'role',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
  },
  {
    title: '状态',
    dataIndex: 'using',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
];

function ManageUser() {
  const defaultForm = {
    username: '',
    password: '',
    role: 1,
    using: true
  };
  const winHeight = window.innerHeight;
  const table = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  
  const getUserList = async () => {
    const { code, msg, data } = await fetch('//localhost:4000/api/functions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $fns: 'api/userList'
      })
    }).then((res) => res.json());
    if (code === 1000) {
      setUserList(data);
    } else {
      message.error(msg);
    }
  }

  const submit = async () => {
    const values = await form.validateFields();
    const { code, msg } = await fetch('//localhost:4000/api/functions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $vars: values,
        $fns: 'api/addUser'
      })
    }).then((res) => res.json());
    if (code === 1000) {
      message.success(msg);
      setShowModal(false);
      getUserList();
    } else {
      message.error(msg);
    }
  }

  useEffect(() => {
    const { offsetTop } = table.current as HTMLDivElement;
    setMaxHeight(winHeight - offsetTop - 185);
  }, [userList, window.innerHeight]);
  useEffect(() => {
    getUserList();
  }, []);
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
          <Button
            onClick={() => setShowModal(true)}
            type="primary">新建用户</Button>
        </div>
        <Table
          rowKey="_id"
          scroll={{ y: maxHeight }}
          className="result-table"
          dataSource={userList}
          columns={columns} />
      </div>
      <Modal
        width="450px"
        destroyOnClose={true}
        visible={showModal}
        onOk={submit}
        onCancel={() => setShowModal(false)}
        title="新建用户">
        <Form
          initialValues={defaultForm}
          form={ form }
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]} >
            <Input autoComplete="off" placeholder="用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]} >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role">
            <Radio.Group>
              <Radio value={1}>管理员</Radio>
              <Radio value={2}>用户</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="状态"
            name="using">
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUser;
import * as React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import IconFont from '../components/icon-font';
import Logo from '../assets/imgs/pineapple.svg';

const UserIcon = (props: any) => <IconFont size="18px" name="icon-geren"></IconFont>;
const PwdIcon = (props: any) => <IconFont size="18px" name="icon-pwd"></IconFont>
export default (props: any) => {
  return (
    <div className="login-container">
      <div className="login-fields">
        <img src={ Logo } />
        <div className="name">Pineapple</div>
        <div className="slogn">一个基于 svg 的图标管理和组件化方案</div>
        <Form
          className="login-form"
          name="basic"
          initialValues={{ remember: true }} >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]} >
            <Input autoComplete="off" placeholder="用户名" size="large" prefix={ <UserIcon /> } />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]} >
            <Input.Password prefix={ <PwdIcon /> }  placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住用户名</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button size="large" block type="primary" htmlType="submit">
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
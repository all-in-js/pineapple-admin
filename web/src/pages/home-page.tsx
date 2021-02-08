import * as React from 'react';
import {
  Link
} from "react-router-dom";
import { Table, Button, Form, Input, Select, Modal, Switch, Popconfirm, message } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';

const {
  useState,
  useEffect,
  useRef
} = React;

interface ProjectForm {
  name: string;
  alias: string;
  mark?: string;
  using: boolean;
}

const { Option } = Select;

const defaultForm: ProjectForm = {
  name: '',
  alias: '',
  mark: '',
  using: true
};

interface SearchProjectParams {
  name?: string;
  alias?: string;
  creator?: string;
  using?: number | boolean;
};

const defaultSearchParams: SearchProjectParams = {
  name: '',
  alias: '',
  creator: '',
  using: -1
};

function HomePage() {
  const winHeight = window.innerHeight;
  const table = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchParams, setSearchParams] = useState<SearchProjectParams>(defaultSearchParams);
  const [maxHeight, setMaxHeight] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    const { offsetTop } = table.current as HTMLDivElement;
    setMaxHeight(winHeight - offsetTop - 185);
  });

  useEffect(() => {
    getProjects();
  }, []);

  const SwitchStatus = ({row}: any) => {
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(!row.using);
    const handleChange = async () => {
      setLoading(true);
      const { code, msg } = await fetch('/api/functions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          $fns: 'api/toggleProjectStatus',
          $vars: {
            id: row._id,
            newStatus: !row.using
          }
        })
      }).then((res) => res.json());
      setLoading(false);
      if (code === 1000) {
        getProjects();
      } else {
        message.error(msg);
      }
    }
    return <Switch
            size="small"
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={checked}
            loading={loading}
            onChange={handleChange} />;
  }

  async function confirm(alias: string) {
    const { code, msg } = await fetch('/api/functions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $fns: 'api/deleteProject',
        $vars: {
          alias
        }
      })
    }).then((res) => res.json());
    if (code === 1000) {
      message.success(msg);
      getProjects();
    } else {
      message.error(msg);
    }
  }

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 150,
      render(val: string, row: any) {
        return <Link to={`/icons/${row.alias}`}>{ val }</Link>
      }
    },
    {
      title: '简称(alias)',
      dataIndex: 'alias',
      width: 120
    },
    {
      title: '图标数',
      dataIndex: 'totalIcons',
      width: 80,
      render(val: number) {
        return <div className="num-style">{val || 0}</div>;
      }
    },
    {
      title: '成员数',
      dataIndex: 'totalMembers',
      width: 80,
      render(val: string[]) {
        return <div className="num-style">{val.length}</div>;
      }
    },
    {
      title: '备注',
      dataIndex: 'mark',
      width: 180
    },
    {
      title: '状态',
      dataIndex: 'using',
      width: 90,
      render(val: boolean) {
        return val ?
                <span className="using">已启用</span> :
                <span className="forbidden">已禁用</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render(val: any, row: {[key: string]: any}) {
        return [
          <Button key={0} type="link">编辑</Button>,
          <Popconfirm
            key={1}
            title="确定删除该项目及相关联的所有图标吗？"
            onConfirm={() => confirm(row.alias)}
            okText="确定"
            cancelText="取消">
            <Button type="link">删除</Button>
          </Popconfirm>,
          <SwitchStatus key={2} row={row} />
        ];
      }
    },
  ];
  async function getProjects() {
    setLoadingData(true);
    const { code, msg, data } = await fetch('/api/functions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $fns: 'api/projects'
      })
    }).then((res) => res.json());
    setLoadingData(false);
    if (code === 1000) {
      setProjects(data);
    } else {
      message.error(msg);
    }
  }

  async function submit() {
    const values = await form.validateFields();
    const { code, msg } = await fetch('/api/functions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $vars: values,
        $fns: 'api/addProject'
      })
    }).then((res) => res.json());
    if (code === 1000) {
      message.success(msg);
      closeModal();
      getProjects();
    } else {
      message.error(msg);
    }
  }
  async function closeModal() {
    form.resetFields();
    setShowModal(false);
  }

  const onUsingChange = (val: valueType) => {
    searchParams.using = val as number;
    setSearchParams({...searchParams});
  }
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.name = e.target.value;
    setSearchParams({...searchParams});
  }
  const onAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.alias = e.target.value;
    setSearchParams({...searchParams});
  }
  const onCreatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.creator = e.target.value;
    setSearchParams({...searchParams});
  }
  const search = async (defaultParams?: SearchProjectParams) => {
    const params = {...(defaultParams || searchParams)};
    if ([0, 1].includes(params.using as number)) {
      params.using = !!params.using;
    } else {
      params.using = undefined;
    }
    
    const { code, msg, data } = await fetch('/api/functions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $vars: params,
        $fns: 'api/projects'
      })
    }).then((res) => res.json());
    if (code === 1000) {
      setProjects(data);
    } else {
      message.error(msg);
    }
  }
  const reset = () => {
    setSearchParams({...defaultSearchParams});
    search({...defaultSearchParams});
  }
  return (
    <div
      ref={ table }
      className="manage-project-page">
      <div className="search-content">
        <div className="search-head">
          <b>检索条件</b>
          <div>
            <Button
              onClick={reset}
              type="text">重置</Button>
            <Button
              onClick={() => search()}
              type="primary">检索</Button>
          </div>
        </div>
        <div className="search-fields">
        <Form layout="vertical">
          <Form.Item label="项目名称">
            <Input
              maxLength={30}
              placeholder="请输入项目名称"
              value={searchParams.name}
              onChange={onNameChange} />
          </Form.Item>
          <Form.Item label="项目简称">
            <Input
              maxLength={20}
              placeholder="请输入项目alias"
              value={searchParams.alias}
              onChange={onAliasChange} />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="请选择"
              value={searchParams.using as number}
              onChange={onUsingChange}>
              <Option value={-1}>全部</Option>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
        </div>
      </div>
      <div className="result-content">
        <div className="result-head">
          <span>检索结果：共{projects.length}条</span>
          <Button
            onClick={() => setShowModal(true)}
            type="primary">新建项目</Button>
        </div>
        <Table
          rowKey="_id"
          loading={loadingData}
          scroll={{ y: maxHeight }}
          className="result-table"
          dataSource={projects}
          columns={columns} />
      </div>
      <Modal
        width="450px"
        destroyOnClose={true}
        visible={showModal}
        title="新建项目"
        onOk={submit}
        onCancel={closeModal}>
        <Form
          initialValues={defaultForm}
          form={form}
          labelCol={{span: 5}}
          wrapperCol={{span: 17}}>
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名！' }]} >
            <Input
              autoComplete="off"
              placeholder="项目名称"
              maxLength={20}/>
          </Form.Item>
          <Form.Item
            label="简称(alias)"
            name="alias"
            rules={[{ required: true, message: '请输入项目简称！' }]} >
            <Input
              maxLength={30}
              placeholder="支持数字字母和下划线" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="mark">
            <Input.TextArea
              maxLength={50}
              placeholder="项目备注"></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="是否启用"
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

export default HomePage;
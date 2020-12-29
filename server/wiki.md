## 接口设计

mongoDB + graphql

统一接口地址：/v1/pineapple/resources

### 系统

### 用户、权限管理

角色：superAdmin, user

系统默认的角色为 superAdmin，初始密码为 123456，所有的 user 只能由 superAdmin 创建，初始密码都为 123456；

* collection

```js
{
  _id: ObjectID,
  name: String,
  displayName: String,
  pass: String,
  email: String,
  role: String,
  updateTime: Date
}
```

| operation | schema | variables | 说明 |
| --- | --- | --- | --- |
| query | | | 用户列表 |
| mutation | | | 创建用户 |
| mutation | | | 修改密码 |
| mutation | | | 删除用户 |

### 登录

| operation | schema | variables | 说明 |
| --- | --- | --- | --- |
| mutation | | | 登录 |

### 项目管理

superAdmin 可以对所有项目进行管理，user 只能看到公开的项目和其所在的项目，user 也能管理自己创建的项目

* collection

```js
{
  _id: ObjectID,
  name: String,
  alias: String,
  mark: String,
  creatorId: ObjectID,
  svgCount: Number,
  members: [creator_id],
  stars: [creator_id],
  imgUrl: String,
  updateTime: Date
}
```

| operation | schema | variables | 说明 |
| --- | --- | --- | --- |
| query | | | 项目列表 |
| mutation | | | 创建项目 |
| mutation | | | 删除项目 |
| mutation | | | 添加成员 |
| mutation | | | 编辑 |
| mutation | | | 添加图标 |
| mutation | | | 导出项目图标 |

### 项目图标管理

* collection

```js
{
  _id: ObjectID,
  name: String,
  creatorId: ObjectID,
  data: String,
  width: Number,
  height: Number,
  viewBox: String,
  alias: String,
  updateTime: Date
}
```

| operation | schema | variables | 说明 |
| --- | --- | --- | --- |
| query | | | | 图标列表 |
| mutation | | | 删除图标 |
| mutation | | | 编辑图标 |
| mutation | | | 下载图标 |

### 动态

公开和所属项目：项目的增删改、图标的增删改

* collection

```js
{
  _id: ObjectID,
  userId: ObjectID,
  creatorId: ObjectID,
  project: Boolean,
  svg: Boolean,
  operate: String,
  activeTime: Date
}
```

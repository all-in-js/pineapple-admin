
import md5 from 'md5';
import { ObjectID } from 'mongodb';

function randColor() {
  return Math.round(Math.random() * 255);
}
/**
 * 新建用户
 * {
 *  username: 用户名
 *  password: 密码，存md5值
 *  role: 用户类型，1: 管理员，2: 用户
 *  using: 是否启用
 * }
 */
interface NewUserParams {
  username: string;
  password: string;
  role: number;
  using: boolean;
}
export async function addUser(cx: KoaContext, vars: NewUserParams) {
  const {
    username,
    password,
    role,
    using
  } = vars;

  if (!username || !password) {
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 'username' and 'password' expected.`,
      data: null
    };
  }

  const userInfo = await cx.$user.findOne({username});
  if (userInfo) {
    const {
      code,
      msg
    } = cx.codes.RESOURCE_REPEAT;
    return {
      code,
      msg: `${msg}: 用户名重复` 
    };
  }

  const pwdHash = md5(password);
  await cx.$user.insertOne({
    username,
    password: pwdHash,
    role,
    using,
    imgColor: `rgb(${randColor()},${randColor()},${randColor()})`,
    createTime: Date.now(),
    creator: ''
  });

  const {
    code
  } = cx.codes.SUCCESS;

  return {
    code,
    msg: '用户新建成功',
    data: null
  };
}

/**
 * 用户列表，
 * 1. 检索条件
 * {
 *  username: 用户名
 *  creator: 创建者
 *  using: 是否启用
 *  role: 用户类型
 * }
 */
interface SearchUserParams {
  username?: string;
  creator?: string;
  using?: boolean;
  role?: number;
}
export async function userList(cx: KoaContext, vars: SearchUserParams) {
  const {
    username,
    creator,
    using,
    role
  } = vars;
  const query: SearchUserParams = {};

  if(username) {
    query.username = username;
  }
  if (creator) {
    query.creator = creator;
  }
  if (using !== undefined) {
    query.using = using;
  }
  if (role !== undefined) {
    query.role = role;
  }

  const data = await cx.$user.find(query).sort({createTime: -1}).toArray();

  return {
    code: cx.codes.SUCCESS.code,
    data
  };
}

/**
 * 删除用户，同时会删除名下图标项目和所有图标
 * {
 *  id: 用户id
 * }
 */
interface DeleteUserParams {
  id: string;
}
export async function deleteUser(cx: KoaContext, vars: DeleteUserParams) {
  if (!vars.id) {
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 'id' expected.`
    };
  }
  const _id = new ObjectID(vars.id);
  await cx.$user.deleteOne({_id});
  await cx.$project.deleteMany({owner: _id});
  await cx.$svg.deleteMany({owner: _id});
  return {
    code: cx.codes.SUCCESS.code,
    msg: '已删除该用户及其名下相关资源'
  };
}

/**
 * 切换用户状态
 * {
 *  id: 用户id
 *  newStatus: 新的用户状态
 * }
 */
interface UserStatusParams {
  id: string;
  newStatus: boolean;
}
export async function toggleUserStatus(cx: KoaContext, vars: UserStatusParams) {
  if (!vars.id || vars.newStatus === undefined) {
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 'id' and 'newStatus' expected.`
    };
  }
  await cx.$user.updateOne({_id: new ObjectID(vars.id)}, {$set: {using: vars.newStatus}});
  return {
    code: cx.codes.SUCCESS.code,
    msg: '用户状态修改成功'
  }
}

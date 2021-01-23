
import md5 from 'md5';
import { ObjectID } from 'mongodb';

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
    return cx.body = {
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
    createTime: Date.now()
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

export async function userList(cx: KoaContext) {
  const data = await cx.$user.find({}).sort({createTime: -1}).toArray();
  return {
    code: cx.codes.SUCCESS.code,
    data
  };
}

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
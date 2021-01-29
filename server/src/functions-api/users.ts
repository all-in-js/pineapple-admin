
import md5 from 'md5';
import fs from 'fs-extra';
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

interface UploadParams {
  alias?: string;
  name?: string;
}
export async function upload(cx: KoaContext, vars: UploadParams) {
  const { alias, name } = vars;
  if (!alias || !name) {
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 'alias' and 'name' expected.`
    }
  }
  const file = (cx.request as any).files.svg;
  if (!file) {
    const {
      code,
      msg
    } = cx.codes.NOT_FOUND;
    return {
      code,
      msg: `${msg}: 未接收到上传的文件`
    };
  }

  /**
   * 校验文件类型
   */
  const isSvg = file.type.startsWith('image/svg');
  if (!isSvg) {
    fs.removeSync(file.path);
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 不支持的文件类型`
    };
  }
  /**
   * 同一个项目下是否存在重复
   */
  const hasSvg = await cx.$svg.findOne({ alias, name });
  if (hasSvg) {
    fs.removeSync(file.path);
    const {
      code,
      msg
    } = cx.codes.RESOURCE_REPEAT;
    return {
      code,
      msg: `${msg}: 重复的图标`
    };
  }
  
  const svgContent = fs.readFileSync(file.path).toString();
  /**
   * svgo optimize
   */
  // TODO: import svgo
  const svgInfo = {
    name: ''
  }; // await svgo.build(name, svgContent);
  /**
   * save
   */
  const timeStamp = Date.now();
  const { uid: userId, displayName: userName } = cx.userInfo || {};
  await cx.$svg.insertOne({
    ...svgInfo,
    ...{
      alias,
      userId,
      userName,
      displayName: svgInfo.name,
      createTime: timeStamp
    }});
  /**
   * 删掉上传的文件
   */
  fs.removeSync(file.path);
  cx.body = {
    code: cx.codes.SUCCESS.code,
    data: [],
    msg: '上传成功'
  }
}
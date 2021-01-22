
import md5 from 'md5';

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
    using
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
  const data = await cx.$user.find({}).toArray();
  return {
    code: cx.codes.SUCCESS.code,
    data
  };
}
import Koa from 'koa';
import Cors from '@koa/cors';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import Upload from './utils/upload';
import SvgOptimize from '@megvii-icons/svgo';
import { ObjectID, ObjectId } from 'mongodb';
import { resolveHome, ensureDirSync, readFileSync } from './utils/util';
import download, { createTempFile } from './utils/download';
import { initDatabase } from './tools/init-database';

interface IState {}

const svgo = new SvgOptimize();
const app = new Koa<IState, IExtendContext>();
const router = new Router<IState, IExtendContext>();

initDatabase(app);

app.use(async (cx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    cx.body = {
      code: 0,
      msg: 'Internal Server Error.',
      err: e.message
    }
  }
});

app.use(BodyParser({
  formLimit: '100mb',
  jsonLimit: '100mb'
}));

app.use(Cors());

router.get('/', async (cx, next) => {
  // await cx.$svg.insertOne({
  //   name: 'add',
  //   data: "assss"
  // });
  cx.body = 'hello, world.';
});

/**
 * 新建项目
 * {
 *  id: uid,
 *  name: string,
 *  alias: string,
 *  userId: string,
 *  createTime: timestamp,
 *  updateTime: timestamp,
 *  mark: string
 * }
 */
router.post('/svg-icons/add-project', async (cx, next) => {
  const {
    name,
    alias,
    mark = '',
    userId // TODO
  } = cx.request.body || {};
  if (!name || !alias) {
    cx.status = 400;
    cx.body = {
      code: 0,
      msg: 'name, alias, userId is excepted.'
    }
  } else {
    // TODO: 通过userId校验用户
    /**
     * 名称是否重复
     */
    const hasProjByName = await cx.$project.findOne({ name });
    if (hasProjByName) {
      return cx.body = {
        code: 0,
        msg: '项目名称重复'
      }
    }
    /**
     * alias是否重复
     */
    const hasProjByAlias = await cx.$project.findOne({ alias });
    if (hasProjByAlias) {
      return cx.body = {
        code: 0,
        msg: '项目的alias重复'
      }
    }
    /**
     * 添加项目
     */
    const timeStamp = Date.now();
    await cx.$project.insertOne({
      name,
      alias,
      mark,
      userId,
      likes: [],
      downloads: 0,
      createTime: timeStamp,
      updateTime: timeStamp
    });
    cx.status = 200;
    cx.body = {
      code: 1,
      msg: 'ok'
    }
  }
});

/**
 * 点赞项目
 */
router.post('/svg-icons/project/like-status', async (cx) => {
  const { alias, userId } = cx.request.body;
  if (!alias || !userId) {
    return cx.body = {
      code: 0,
      msg: `'alias' and 'userId' excepted.`
    }
  }
  const project = await cx.$project.findOne({ alias });
  if (project) {
    let like = true;
    let { likes } = project;
    if (likes && likes.length) {
      if (likes.includes(userId)) {
        likes = likes.filter((id: string) => id !== userId);
        like = false;
      } else {
        likes.push(userId);
        like = true;
      }
    } else {
      likes = [userId];
      like = true;
    }
    cx.body = {
      code: 1,
      result: like
    }
  } else {
    cx.body = {
      code: 0,
      msg: '项目不存在'
    }
  }
});

/**
 * 下载项目
 */
router.get('/svg-icons/project/download', async (cx) => {
  const { alias } = cx.query;
  if (!alias) {
    return cx.body = {
      code: 0,
      msg: `'alias' excepted.`
    }
  }
  const svgs = await cx.$svg.find({ alias }).toArray();
  if (!svgs.length) {
    return cx.body = {
      code: 0,
      msg: 'no svg.'
    }
  }
  /**
   * 更新下载量
   */
  await cx.$project.updateOne({ alias }, { $inc: { downloads: 1}});
  // TODO: 批量下载
});

/**
 * 更新项目名称
 */
router.post('/svg-icons/project/update-name', async (cx) => {
  const { newName, alias } = cx.request.body;
  if (!newName || !alias) {
    return cx.body = {
      code: 0,
      msg: `'newName' and 'alias' excepted.`
    }
  }
  const project = await cx.$project.findOne({ alias });
  if (!project) {
    return cx.body = {
      code: 0,
      msg: '项目不存在'
    }
  }
  if (project.name === newName) {
    return cx.body = {
      code: 1,
      result: []
    }
  }
  await cx.$project.updateOne({ alias }, { $set: { name: newName }});
  cx.body = {
    code: 1,
    result: []
  }
});

/**
 * 项目列表
 */
router.get('/svg-icons/projects', async (cx, next) => {
  // TODO: 添加封面
  const projects = await cx.$project.find({}).toArray();
  if (projects.length) {
    for (const proj of projects) {
      const svgs = await cx.$svg.find({
        alias: proj.alias
      }).toArray();
      proj.icons = svgs;
    }
  }
  cx.body = {
    code: 1,
    result: projects
  }
});

/**
 * 导出项目的图标
 */
router.post('/svg-icons/export', async (cx) => {
  const { type, alias, id } = cx.query;
  if (!type) {
    return cx.body = {
      code: 0,
      msg: `'type' excepted.`
    }
  }
  if (type === 'svg') {
    if (!id) {
      return cx.body = {
        code: 0,
        msg: `'id' excepted.`
      }
    }
  } else {
    if (!alias) {
      return cx.body = {
        code: 0,
        msg: `'alias' excepted.`
      }
    }
  }
  
  if (type === 'js') {
    /**
     * 导出.js
     */
    const svgs = await createSvgJson(cx, [alias]);
    const filepath = createTempFile(alias, `module.exports = ${JSON.stringify(svgs)};`);
    download(cx, 'application/javascript', filepath);
  }
  if (type === 'svg') {
    /**
     * 导出.svg
     */
    const svgInfo = await cx.$svg.findOne({ _id: new ObjectID(id) });
    if (svgInfo) {
      const svg = await createSvg(svgInfo);
      const filepath = createTempFile(svgInfo.name, svg, 'svg');
      download(cx, 'text/xml', filepath);
    } else {
      cx.body = {
        code: 0,
        msg: `svg文件不存在.`
      }
    }
  }
});

/**
 * 删除项目
 */
router.post('/svg-icons/project/remove', async (cx) => {
  const { alias } = cx.request.body;
  if (!alias) {
    return cx.body = {
      code: 0,
      msg: `'alias' excepted.`
    }
  }
  await cx.$project.deleteOne({ alias });
  return cx.body = {
    code: 1,
    result: []
  }
});

/**
 * 上传图标
 */
router.post('/svg-icons/upload', async (cx) => {
  const { alias, name } = cx.query;
  /**
   * 同一个项目下是否存在重复
   */
  const hasSvg = await cx.$svg.findOne({ alias, name });
  if (hasSvg) {
    return cx.body = {
      code: 0,
      msg: '重复的图标'
    }
  }

  const uploadDir = resolveHome('.svg-sources');
  ensureDirSync(uploadDir);
  const form = new Upload({
    key: 'svg',
    uploadDir,
    keepExtensions: true
  });
  const file = await form.transform(cx.req);
  const svgContent = readFileSync(file.path).toString();
  /**
   * svgo optimize
   */
  const svgInfo = await svgo.build(name, svgContent);
  /**
   * save
   */
  const timeStamp = Date.now();
  await cx.$svg.insertOne({
    ...svgInfo,
    ...{
      alias,
      createTime: timeStamp,
      updateTime: timeStamp,
      source: file.path.replace(uploadDir, '')
    }});
  cx.body = {
    code: 1,
    result: []
  }
});

/**
 * 查询项目里的图标
 */
router.get('/svg-icons/:alias/list', async (cx) => {
  const { alias } = cx.params;
  /**
   * 检查alias
   */
  const project = await cx.$project.findOne({ alias });
  if (!project) {
    return cx.body = {
      code: 0,
      msg: '项目不存在'
    }
  }
  const svgs = await cx.$svg.find({ alias }).toArray();
  cx.body = {
    code: 1,
    result: {
      project,
      svgs
    }
  }
});

/**
 * 更新图标名称
 */
router.post('/svg-icons/icon/update-name', async (cx) => {
  const { newName, id } = cx.request.body;
  if (!newName || !id) {
    return cx.body = {
      code: 0,
      msg: `'newName' and 'id' excepted.`
    }
  }
  const oid = new ObjectId(id);
  const svg = await cx.$svg.findOne({ _id: oid });
  if (!svg) {
    return cx.body = {
      code: 0,
      msg: '图标不存在'
    }
  }
  if (svg.name === newName) {
    return cx.body = {
      code: 1,
      msg: []
    }
  }
  await cx.$svg.updateOne({ _id: oid }, { $set: { name: newName }});
  return cx.body = {
    code: 1,
    msg: []
  }
});

/**
 * 删除图标
 */
router.post('/svg-icons/icon/remove', async (cx) => {
  const { id } = cx.request.body;
  if (!id) {
    return cx.body = {
      code: 0,
      msg: `'id' excepted.`
    }
  }
  await cx.$svg.deleteOne({ _id: new ObjectId(id) });
  cx.body = {
    code: 1,
    result: []
  }
});

/**
 * 下载图标
 */
router.get('/svg-icons/icon/download', async (cx) => {
  const { id } = cx.query;
  if (!id) {
    return cx.body = {
      code: 0,
      msg: `'id' excepted.`
    }
  }
  const svg = await cx.$svg.findOne({ _id: new ObjectId(id) });
  if (!svg) {
    return cx.body = {
      code: 0,
      msg: '图标不存在'
    }
  }
  // TODO: 下载图标
});

/**
 * 请求项目的icons
 */
router.get('/svg-icons/pull-svg-icons', async (cx) => {
  let { projects = 'common' } = cx.query;
  projects = projects.split(',');
  const svgs = await createSvgJson(cx, projects);
  cx.body = {
    code: 1,
    result: svgs
  }
});

async function createSvgJson(cx: KoaContext, projects: string[]) {
  let svgs = await cx.$svg.find({alias: { $in: projects }}).toArray();
  if (svgs && svgs.length) {
    svgs = svgs.reduce((curr, item) => {
      let { name } = item;
      if (curr[name]) {
        name = `${item.alias}/${name}`;
      }
      curr[name] = item;
      return curr;
    }, {});
  }
  return svgs;
}

async function createSvg(svgInfo: {[key: string]: any}) {
  const { width, height, viewBox, data } = svgInfo;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${width}" height="${height}" viewBox="${viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${data}
  </svg>
  `;
}

/**
 * 按项目，按图标检索
 */
router.get('/svg-icons/search', async (cx) => {
  const { type, key } = cx.query;
  if (!type || !key) {
    return cx.body = {
      code: 0,
      msg: `'type' and 'key' excepted.`
    }
  }

  const reg = new RegExp(key, 'gi');
  if (type === 'project') {
    /**
     * 按项目名称和alias检索
     */
    const projects = await cx.$project.find({
      $or: [
        {
          alias: { $regex: reg }
        },
        {
          name: { $regex: reg }
        }
      ]
    }).toArray();
    if (projects.length) {
      for (const proj of projects) {
        const svgs = await cx.$svg.find({
          alias: proj.alias
        }).toArray();
        proj.icons = svgs;
      }
    }
    return cx.body = {
      code: 1,
      result: projects
    }
  }
  if (type === 'icon') {
    /**
     * 按图标名称检索
     */
    const svgs = await cx.$svg.find({ name: { $regex: reg }}).toArray();
    return cx.body = {
      code: 1,
      result: svgs
    }
  }
  cx.body = {
    code: 1,
    result: []
  }
});

app.use(router.routes() as Koa.Middleware);

app.listen(2333, () => {
  console.log('server listening at 2333.');
});
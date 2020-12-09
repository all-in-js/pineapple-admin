'use strict';

var Koa = require('koa');
var Cors = require('@koa/cors');
var Router = require('koa-router');
var BodyParser = require('koa-bodyparser');
var formidable = require('formidable');
var SvgOptimize = require('@megvii-icons/svgo');
var MongoDB = require('mongodb');
var os2 = require('os');
var path2 = require('path');
var fs = require('fs-extra');
var contentDisposition = require('content-disposition');
var Dotenv = require('dotenv');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var Cors__default = /*#__PURE__*/_interopDefaultLegacy(Cors);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var BodyParser__default = /*#__PURE__*/_interopDefaultLegacy(BodyParser);
var SvgOptimize__default = /*#__PURE__*/_interopDefaultLegacy(SvgOptimize);
var MongoDB__default = /*#__PURE__*/_interopDefaultLegacy(MongoDB);
var os2__default = /*#__PURE__*/_interopDefaultLegacy(os2);
var path2__default = /*#__PURE__*/_interopDefaultLegacy(path2);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var contentDisposition__default = /*#__PURE__*/_interopDefaultLegacy(contentDisposition);
var Dotenv__default = /*#__PURE__*/_interopDefaultLegacy(Dotenv);

class Upload extends formidable.IncomingForm {
  constructor(options) {
    super(options);
    this.key = options.key;
  }
  transform(req) {
    return new Promise((rs, rj) => {
      try {
        this.parse(req, (err, fields, files) => {
          if (err) {
            rj(err);
          } else {
            rs(files[this.key]);
          }
        });
      } catch (e) {
        rj(e);
      }
    });
  }
}

function getHomedir() {
  return (typeof os2__default['default'].homedir == "function" ? os2__default['default'].homedir() : process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]) || "~";
}
function resolveHome(...target) {
  target.unshift(getHomedir());
  return path2__default['default'].resolve(...target);
}

function createTempFile(name, content, suffix) {
  const filepath = resolveHome(`${name}.${suffix || "js"}`);
  fs__default['default'].ensureFileSync(filepath);
  fs__default['default'].writeFileSync(filepath, content);
  return filepath;
}
function download(cx, contentType, filepath) {
  cx.set("Content-Type", contentType);
  cx.set("Content-Disposition", contentDisposition__default['default'](filepath));
  const stream = fs__default['default'].createReadStream(filepath);
  cx.body = stream;
}

const initDatabase = (app) => {
  try {
    const {NODE_ENV} = process.env;
    const dbConfigPath = path2__default['default'].resolve(process.cwd(), `.${NODE_ENV}.env`);
    const env = Dotenv__default['default'].config({path: dbConfigPath}).parsed || {};
    (async () => {
      const mongoClient = await MongoDB__default['default'].MongoClient.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`);
      const $collection = (col) => {
        return mongoClient.db(env.DB_DATABASE).collection(col);
      };
      const projectModel = $collection("project");
      app.context.$collection = $collection;
      app.context.$project = projectModel;
      app.context.$svg = $collection("svg");
      await createCommonProject(projectModel);
    })();
  } catch (e) {
    throw e;
  }
};
async function createCommonProject($project) {
  const alias = "common";
  const hasCommon = await $project.findOne({alias});
  if (!hasCommon) {
    const timeStamp = Date.now();
    await $project.insertOne({
      alias,
      name: "通用图标集",
      mark: "系统默认的通用图标集",
      createTime: timeStamp,
      updateTime: timeStamp
    });
    console.log(`[${new Date().toLocaleString()}] 已创建通用图标集 $project -> common`);
  }
}

const svgo2 = new SvgOptimize__default['default']();
const app = new Koa__default['default']();
const router = new Router__default['default']();
initDatabase(app);
app.use(async (cx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    cx.body = {
      code: 0,
      msg: "Internal Server Error.",
      err: e.message
    };
  }
});
app.use(BodyParser__default['default']({
  formLimit: "100mb",
  jsonLimit: "100mb"
}));
app.use(Cors__default['default']());
router.get("/", async (cx, next) => {
  cx.body = "hello, world.";
});
router.post("/svg-icons/add-project", async (cx, next) => {
  const {
    name,
    alias,
    mark = "",
    userId
  } = cx.request.body || {};
  if (!name || !alias) {
    cx.status = 400;
    cx.body = {
      code: 0,
      msg: "name, alias, userId is excepted."
    };
  } else {
    const hasProjByName = await cx.$project.findOne({name});
    if (hasProjByName) {
      return cx.body = {
        code: 0,
        msg: "项目名称重复"
      };
    }
    const hasProjByAlias = await cx.$project.findOne({alias});
    if (hasProjByAlias) {
      return cx.body = {
        code: 0,
        msg: "项目的alias重复"
      };
    }
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
      msg: "ok"
    };
  }
});
router.post("/svg-icons/project/like-status", async (cx) => {
  const {alias, userId} = cx.request.body;
  if (!alias || !userId) {
    return cx.body = {
      code: 0,
      msg: `'alias' and 'userId' excepted.`
    };
  }
  const project = await cx.$project.findOne({alias});
  if (project) {
    let like = true;
    let {likes} = project;
    if (likes && likes.length) {
      if (likes.includes(userId)) {
        likes = likes.filter((id) => id !== userId);
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
    };
  } else {
    cx.body = {
      code: 0,
      msg: "项目不存在"
    };
  }
});
router.get("/svg-icons/project/download", async (cx) => {
  const {alias} = cx.query;
  if (!alias) {
    return cx.body = {
      code: 0,
      msg: `'alias' excepted.`
    };
  }
  const svgs = await cx.$svg.find({alias}).toArray();
  if (!svgs.length) {
    return cx.body = {
      code: 0,
      msg: "no svg."
    };
  }
  await cx.$project.updateOne({alias}, {$inc: {downloads: 1}});
});
router.post("/svg-icons/project/update-name", async (cx) => {
  const {newName, alias} = cx.request.body;
  if (!newName || !alias) {
    return cx.body = {
      code: 0,
      msg: `'newName' and 'alias' excepted.`
    };
  }
  const project = await cx.$project.findOne({alias});
  if (!project) {
    return cx.body = {
      code: 0,
      msg: "项目不存在"
    };
  }
  if (project.name === newName) {
    return cx.body = {
      code: 1,
      result: []
    };
  }
  await cx.$project.updateOne({alias}, {$set: {name: newName}});
  cx.body = {
    code: 1,
    result: []
  };
});
router.get("/svg-icons/projects", async (cx, next) => {
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
  };
});
router.post("/svg-icons/export", async (cx) => {
  const {type, alias, id} = cx.query;
  if (!type) {
    return cx.body = {
      code: 0,
      msg: `'type' excepted.`
    };
  }
  if (type === "svg") {
    if (!id) {
      return cx.body = {
        code: 0,
        msg: `'id' excepted.`
      };
    }
  } else {
    if (!alias) {
      return cx.body = {
        code: 0,
        msg: `'alias' excepted.`
      };
    }
  }
  if (type === "js") {
    const svgs = await createSvgJson(cx, [alias]);
    const filepath = createTempFile(alias, `module.exports = ${JSON.stringify(svgs)};`);
    download(cx, "application/javascript", filepath);
  }
  if (type === "svg") {
    const svgInfo = await cx.$svg.findOne({_id: new MongoDB.ObjectID(id)});
    if (svgInfo) {
      const svg = await createSvg(svgInfo);
      const filepath = createTempFile(svgInfo.name, svg, "svg");
      download(cx, "text/xml", filepath);
    } else {
      cx.body = {
        code: 0,
        msg: `svg文件不存在.`
      };
    }
  }
});
router.post("/svg-icons/project/remove", async (cx) => {
  const {alias} = cx.request.body;
  if (!alias) {
    return cx.body = {
      code: 0,
      msg: `'alias' excepted.`
    };
  }
  await cx.$project.deleteOne({alias});
  return cx.body = {
    code: 1,
    result: []
  };
});
router.post("/svg-icons/upload", async (cx) => {
  const {alias, name} = cx.query;
  const hasSvg = await cx.$svg.findOne({alias, name});
  if (hasSvg) {
    return cx.body = {
      code: 0,
      msg: "重复的图标"
    };
  }
  const uploadDir = resolveHome(".svg-sources");
  fs.ensureDirSync(uploadDir);
  const form = new Upload({
    key: "svg",
    uploadDir,
    keepExtensions: true
  });
  const file = await form.transform(cx.req);
  const svgContent = fs.readFileSync(file.path).toString();
  const svgInfo = await svgo2.build(name, svgContent);
  const timeStamp = Date.now();
  await cx.$svg.insertOne({
    ...svgInfo,
    ...{
      alias,
      createTime: timeStamp,
      updateTime: timeStamp,
      source: file.path.replace(uploadDir, "")
    }
  });
  cx.body = {
    code: 1,
    result: []
  };
});
router.get("/svg-icons/:alias/list", async (cx) => {
  const {alias} = cx.params;
  const project = await cx.$project.findOne({alias});
  if (!project) {
    return cx.body = {
      code: 0,
      msg: "项目不存在"
    };
  }
  const svgs = await cx.$svg.find({alias}).toArray();
  cx.body = {
    code: 1,
    result: {
      project,
      svgs
    }
  };
});
router.post("/svg-icons/icon/update-name", async (cx) => {
  const {newName, id} = cx.request.body;
  if (!newName || !id) {
    return cx.body = {
      code: 0,
      msg: `'newName' and 'id' excepted.`
    };
  }
  const oid = new MongoDB.ObjectId(id);
  const svg = await cx.$svg.findOne({_id: oid});
  if (!svg) {
    return cx.body = {
      code: 0,
      msg: "图标不存在"
    };
  }
  if (svg.name === newName) {
    return cx.body = {
      code: 1,
      msg: []
    };
  }
  await cx.$svg.updateOne({_id: oid}, {$set: {name: newName}});
  return cx.body = {
    code: 1,
    msg: []
  };
});
router.post("/svg-icons/icon/remove", async (cx) => {
  const {id} = cx.request.body;
  if (!id) {
    return cx.body = {
      code: 0,
      msg: `'id' excepted.`
    };
  }
  await cx.$svg.deleteOne({_id: new MongoDB.ObjectId(id)});
  cx.body = {
    code: 1,
    result: []
  };
});
router.get("/svg-icons/icon/download", async (cx) => {
  const {id} = cx.query;
  if (!id) {
    return cx.body = {
      code: 0,
      msg: `'id' excepted.`
    };
  }
  const svg = await cx.$svg.findOne({_id: new MongoDB.ObjectId(id)});
  if (!svg) {
    return cx.body = {
      code: 0,
      msg: "图标不存在"
    };
  }
});
router.get("/svg-icons/pull-svg-icons", async (cx) => {
  let {projects = "common"} = cx.query;
  projects = projects.split(",");
  const svgs = await createSvgJson(cx, projects);
  cx.body = {
    code: 1,
    result: svgs
  };
});
async function createSvgJson(cx, projects) {
  let svgs = await cx.$svg.find({alias: {$in: projects}}).toArray();
  if (svgs && svgs.length) {
    svgs = svgs.reduce((curr, item) => {
      let {name} = item;
      if (curr[name]) {
        name = `${item.alias}/${name}`;
      }
      curr[name] = item;
      return curr;
    }, {});
  }
  return svgs;
}
async function createSvg(svgInfo) {
  const {width, height, viewBox, data} = svgInfo;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${width}" height="${height}" viewBox="${viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${data}
  </svg>
  `;
}
router.get("/svg-icons/search", async (cx) => {
  const {type, key} = cx.query;
  if (!type || !key) {
    return cx.body = {
      code: 0,
      msg: `'type' and 'key' excepted.`
    };
  }
  const reg = new RegExp(key, "gi");
  if (type === "project") {
    const projects = await cx.$project.find({
      $or: [
        {
          alias: {$regex: reg}
        },
        {
          name: {$regex: reg}
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
    };
  }
  if (type === "icon") {
    const svgs = await cx.$svg.find({name: {$regex: reg}}).toArray();
    return cx.body = {
      code: 1,
      result: svgs
    };
  }
  cx.body = {
    code: 1,
    result: []
  };
});
app.use(router.routes());
app.listen(2333, () => {
  console.log("server listening at 2333.");
});

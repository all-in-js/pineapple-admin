import { ObjectID } from 'mongodb';

export async function projects(cx: KoaContext) {
  const projects = await cx.$project.find().toArray();
  return projects;
}

type params = {
  id: string;
}
export async function project(cx: KoaContext, vars: params) {
  const { id } = vars;
  if (!id) {
    cx.status = 400;
    return {
      success: false,
      msg: `'id' expected.`
    }
  }
  const project = await cx.$project.findOne({_id: new ObjectID(id)});
  return project;
}
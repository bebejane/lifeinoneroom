type Routes = {
  [key: string]: Route
}

type Route = {
  path: ((item?: any) => Promise<string[] | null>)
  typeName: string
}

const routes: Routes = {
  "image": {
    typeName: "ImageRecord",
    path: async (item) => [`/posts/${item.slug}`, '/']
  },
  "text": {
    typeName: "TextRecord",
    path: async (item) => [`/posts/${item.slug}`, '/']
  },
  "about": {
    typeName: "AboutRecord",
    path: async (item) => ['/']
  },
  "introduction": {
    typeName: "IntroductionRecord",
    path: async (item) => ['/']
  },
}

export const buildRoute = async (model: string, item?: any): Promise<string[]> => {
  if (!routes[model]) throw new Error(`Invalid model: ${model}`)
  return await routes[model].path(item)
}

export const recordToRoute = async (record: any): Promise<string[]> => {
  const { __typename } = record
  const model = Object.keys(routes).find(key => routes[key].typeName === __typename)
  if (!model) throw new Error(`Invalid record: ${__typename}`)
  return await buildRoute(model, record)
}

export default routes
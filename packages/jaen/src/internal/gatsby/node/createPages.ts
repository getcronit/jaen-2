import {GatsbyNode} from 'gatsby'
import path from 'path'
import {JaenPage, JaenPluginOptions} from '../../types'

export const createPages: GatsbyNode['createPages'] = async (
  {actions, graphql, reporter},
  pluginOptions: JaenPluginOptions
) => {
  const {createPage} = actions

  interface QueryData {
    allJaenPage: {
      edges: {
        node: JaenPage
      }[]
    }
  }

  const result = await graphql<QueryData>(`
    query {
      allJaenPage {
        edges {
          node {
            id
            slug
            jaenPageMetadata {
              title
              description
              image
              canonical
              datePublished
              isBlogPost
            }
            jaenFields
            chapters
            template {
              name
              displayName
            }
          }
        }
      }
    }
  `)

  if (result.errors || !result.data) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const jaenPages = result.data.allJaenPage.edges

  jaenPages.forEach(({node}) => {
    const {slug} = node
    const {template} = node
    const {rootDir, paths} = pluginOptions.templates

    if (template?.name) {
      const pageTemplatePath = paths[template?.name]

      createPage({
        path: node.slug,
        component: path.join(rootDir, pageTemplatePath),
        context: {
          jaenPageId: node.id
        }
      })
    }
  })

  // Dynamic routing pages

  // stepPage.matchPath is a special key that's used for matching pages
  // only on the client.
  createPage({
    path: '/_',
    matchPath: '/_/*',
    component: require.resolve('./pages/_.tsx'),
    context: {}
  })
}

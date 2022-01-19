import {GatsbyNode} from 'gatsby'
import {JaenPage} from '../../types'

export const onCreatePage: GatsbyNode['onCreatePage'] = ({
  actions,
  page,
  createNodeId,
  createContentDigest,
  getNode
}) => {
  const {createPage, deletePage, createNode} = actions
  const {path, context} = page

  let stepPage = page

  // Check if the page has a `jaenPageId` in its context.
  // If not it means it's not a JaenPage and we must create one.
  if (!context.jaenPageId) {
    const jaenPageId = `JaenPage ${path}`

    if (!getNode(jaenPageId)) {
      const jaenPage: JaenPage = {
        id: jaenPageId,
        slug: path,
        parent: null,
        children: [],
        jaenPageMetadata: {
          title: path,
          description: '',
          image: '',
          canonical: '',
          datePublished: '',
          isBlogPost: false
        },
        jaenFields: null,
        jaenFiles: [],
        chapters: {},
        template: null
      }

      createNode({
        ...jaenPage,
        parent: null,
        children: [],
        jaenFiles: [],
        internal: {
          type: 'JaenPage',
          content: JSON.stringify(jaenPage),
          contentDigest: createContentDigest(jaenPage)
        }
      })
    }

    stepPage = {...stepPage, context: {...context, jaenPageId}}
  }

  deletePage(page)
  createPage(stepPage)
}

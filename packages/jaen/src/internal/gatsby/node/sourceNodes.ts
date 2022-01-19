import {GatsbyNode} from 'gatsby'
import {JaenPage} from '../../types'
import {processPage} from '../helper/imaFields'

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  createNodeId,
  createContentDigest,
  cache,
  store,
  reporter
}) => {
  const {createNode} = actions

  const dummyTemplates = [
    {
      name: 'BlogPage',
      displayName: 'Blog',
      children: [
        {
          id: 'BlogPage'
        }
      ]
    }
  ]

  const dummyJaenPages: JaenPage[] = [
    {
      id: `JaenPage ${createNodeId('jaen-page-1')}`,
      slug: 'jaen-page-1',
      parent: null,
      children: [],
      jaenPageMetadata: {
        title: 'Jaen Page 1',
        description: 'Jaen Page 1 description',
        image: 'https://via.placeholder.com/300x200',
        canonical: 'https://jaen.com/jaen-page-1',
        datePublished: '2020-01-01',
        isBlogPost: false
      },
      jaenFields: {
        'IMA:TextField': {
          jaenField1: 'jaenField1',
          jaenField2: 'jaenField2'
        }
      },
      jaenFiles: undefined as any,
      chapters: {},
      template: 'BlogPage' as any
    },
    {
      id: `JaenPage ${createNodeId('jaen-page-2')}`,
      slug: 'jaen-page-2',
      parent: null,
      children: [{id: `JaenPage ${createNodeId('jaen-page-2-1')}}`}],
      jaenPageMetadata: {
        title: 'Jaen Page 2',
        description: 'Jaen Page 2 description',
        image: 'https://via.placeholder.com/300x200',
        canonical: 'https://jaen.com/jaen-page-2',
        datePublished: '2020-01-01',
        isBlogPost: false
      },
      jaenFields: {
        'IMA:TextField': {
          jaenField1: 'jaenField1',
          jaenField2: 'jaenField2'
        }
      },
      jaenFiles: undefined as any,

      chapters: {
        chapter1: {
          ptrHead: 'JaenSection foo-bar-baz-1',
          ptrTail: 'JaenSection foo-bar-baz-2',
          sections: {
            'JaenSection foo-bar-baz-1': {
              jaenFields: null,
              name: 'BoxSection',
              ptrNext: 'JaenSection foo-bar-baz-2',
              ptrPrev: null // this is the first section of the chapter
            },
            'JaenSection foo-bar-baz-2': {
              jaenFields: null,
              name: 'BoxSection',
              ptrNext: null, // this is the last section of the chapter
              ptrPrev: 'JaenSection foo-bar-baz-1'
            }
          }
        },
        chapter2: {
          ptrHead: 'JaenSection foo-bar-baz-3',
          ptrTail: 'JaenSection foo-bar-baz-5',
          sections: {
            'JaenSection foo-bar-baz-3': {
              jaenFields: null,
              name: 'BoxSection',
              ptrNext: 'JaenSection foo-bar-baz-4',
              ptrPrev: null // this is the first section of the chapter
            },
            'JaenSection foo-bar-baz-4': {
              jaenFields: null,
              name: 'BoxSection',
              ptrNext: 'JaenSection foo-bar-baz-5',
              ptrPrev: 'JaenSection foo-bar-baz-3'
            },
            'JaenSection foo-bar-baz-5': {
              jaenFields: null,
              name: 'BoxSection',
              ptrNext: null, // this is the last section of the chapter
              ptrPrev: 'JaenSection foo-bar-baz-4'
            }
          }
        }
      },
      template: 'BlogPage' as any
    },
    {
      id: `JaenPage ${createNodeId('jaen-page-2-1')}`,
      slug: 'jaen-page-2-1',
      parent: {
        id: `JaenPage ${createNodeId('jaen-page-2')}`
      },
      children: [],
      jaenPageMetadata: {
        title: 'Jaen Page 21',
        description: 'Jaen Page 21 description',
        image: 'https://via.placeholder.com/300x200',
        canonical: 'https://jaen.com/jaen-page-2',
        datePublished: '2020-01-01',
        isBlogPost: false
      },
      jaenFields: {
        'IMA:TextField': {
          jaenField1: 'jaenField1',
          jaenField2: 'jaenField2'
        },
        'IMA:ImageField': {
          jaenField3: {
            internalImageUrl: 'https://via.placeholder.com/300x200'
          }
        }
      },
      jaenFiles: undefined as any,
      chapters: {},
      template: 'BlogPage' as any
    }
  ]

  dummyTemplates.forEach(jaenTemplate => {
    const node = {
      id: jaenTemplate.name,
      ...jaenTemplate,
      children: jaenTemplate.children.map(child => child.id),
      internal: {
        type: 'JaenTemplate',
        content: JSON.stringify(jaenTemplate),
        contentDigest: createContentDigest(jaenTemplate)
      }
    }

    createNode(node)
  })

  dummyJaenPages.forEach(async jaenPage => {
    //> Process IMA fields in page and its chapters

    await processPage({
      page: jaenPage,
      createNodeId,
      createNode,
      cache,
      store,
      reporter
    })

    // @ts-ignore
    console.log('JAENPAGE', jaenPage)

    const node = {
      ...jaenPage,
      template: jaenPage.template || null,
      parent: jaenPage.parent ? jaenPage.parent.id : null,
      children: jaenPage.children.map(child => child.id),
      internal: {
        type: 'JaenPage',
        content: JSON.stringify(jaenPage),
        contentDigest: createContentDigest(jaenPage)
      }
    }

    createNode(node)
  })
}

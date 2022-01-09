import {navigate} from 'gatsby'
import * as React from 'react'

import {useJaenPageTree, useJaenTemplates} from '@src/internal/root'
import {generateOriginPath} from '@src/internal/root/paths'
import {
  store,
  useAppDispatch,
  useAppSelector,
  withRedux
} from '@src/internal/store'
import {updateForPage} from '@src/internal/store/slices/dpathsSlice'
import {
  page_markForDeletion,
  page_updateOrCreate
} from '@src/internal/store/slices/pagesSlice'

import PagesTab from '../components/tabs/Pages'
import {ContentValues} from '../components/tabs/Pages/PageContent'
import {CreateValues} from '../components/tabs/Pages/PageCreator'

export const PagesContainer = withRedux(() => {
  console.log('🚀 ~ file: pages.tsx ~ line 31 ~ PagesContainer ~ withRedux')
  const dispatch = useAppDispatch()
  const pageTree = useJaenPageTree()
  const jaenTemplates = useJaenTemplates()

  const latestAddedPageId = useAppSelector(
    state => state.pages.latestAddedPageId
  )

  let [shouldUpdateDpathsFor, setShouldUpdateDpathsFor] = React.useState<{
    pageId: string
    create: boolean
  } | null>(null)

  console.log(
    '🚀 ~ file: Pages.tsx ~ line 186 ~ PagesContainer ~ shouldUpdateDpathsFor',
    shouldUpdateDpathsFor
  )

  React.useEffect(() => {
    if (shouldUpdateDpathsFor) {
      const {pageId, create} = shouldUpdateDpathsFor

      dispatch(
        updateForPage({
          jaenPageTree: pageTree,
          pageId,
          create
        })
      )

      setShouldUpdateDpathsFor(null)
    }
  }, [pageTree])

  React.useEffect(() => {
    console.log('latestAddedPageId', latestAddedPageId)
    if (latestAddedPageId) {
      dispatch(
        updateForPage({
          jaenPageTree: pageTree,
          pageId: latestAddedPageId,
          create: true
        })
      )
    }
  }, [latestAddedPageId])

  const handlePageGet = React.useCallback(
    id => {
      let jaenPage = pageTree.find(p => p.id === id)

      // TODO: Remove workaround
      if (!jaenPage) {
        jaenPage = pageTree.find(p => p.id === latestAddedPageId)
      }

      if (!jaenPage) {
        throw Error(`PagesContainer:getPage cannot get jaenPage with id ${id}`)
      }

      return jaenPage
    },
    [pageTree]
  )

  const handlePageCreate = React.useCallback(
    (parentId: string | null, values: CreateValues) =>
      dispatch(
        page_updateOrCreate({
          parent: parentId ? {id: parentId} : null,
          slug: values.slug,
          jaenPageMetadata: {
            title: values.title
          },
          template: values.template
        })
      ),
    []
  )

  const handlePageDelete = React.useCallback((id: string) => {
    // shouldUpdateDpathsFor = {pageId: id, create: false}
    setShouldUpdateDpathsFor({pageId: id, create: false})

    dispatch(page_markForDeletion(id))
  }, [])

  const handlePageMove = React.useCallback(
    (id: string, oldParentId: string | null, newParentId: string | null) => {
      setShouldUpdateDpathsFor({pageId: id, create: true})
      dispatch(
        page_updateOrCreate({
          id,
          parent: newParentId ? {id: newParentId} : null,
          fromId: oldParentId || undefined
        })
      )
    },
    []
  )

  const handlePageUpdate = React.useCallback(
    (id: string, values: ContentValues) => {
      setShouldUpdateDpathsFor({pageId: id, create: true})
      dispatch(
        page_updateOrCreate({
          id,
          slug: values.slug,
          jaenPageMetadata: {
            title: values.title,
            description: values.description
          }
        })
      )
    },
    []
  )

  const handlePageNavigate = React.useCallback(
    (id: string) => {
      // Check if the page is a dynamic or static page.
      // Navigate to /_/:path if dynamic, else to /:path
      let node = pageTree.find(p => p.id === id)

      if (!node) {
        node = pageTree.find(p => p.id === latestAddedPageId)!
      }

      console.log(
        '🚀 ~ file: Pages.tsx ~ line 150 ~ PagesContainer ~ node',
        node
      )

      let path = generateOriginPath(pageTree, node)
      console.log(
        '🚀 ~ file: Pages.tsx ~ line 158 ~ PagesContainer ~ path',
        path
      )

      // if (path === '/') {
      //   path += node.slug
      // } else {
      //   path += '/' + node.slug
      // }

      const dynamicPaths = store.getState()?.dpaths.dynamicPaths

      if (path) {
        if (dynamicPaths && path in dynamicPaths) {
          path = `/_${path}`
        }

        navigate(path)
      }
    },
    [pageTree]
  )

  const treeItems = React.useMemo(
    () =>
      pageTree.reduce(
        (a, v) => ({
          ...a,
          [v.id]: {
            id: v.id,
            children: v.children.map(child => child.id),
            data: {
              title: v.jaenPageMetadata.title,
              slug: v.slug,
              template: v.template,
              hasChanges: false,
              deleted: v.deleted
            },
            parent: v.parent?.id || null
          }
        }),
        {}
      ),
    [pageTree]
  )

  return (
    <PagesTab
      items={treeItems}
      templates={jaenTemplates}
      creatorFallbackTemplates={[
        {
          name: 'fb-page',
          displayName: 'Fallback Page'
        }
      ]}
      getPage={handlePageGet}
      onItemCreate={handlePageCreate}
      onItemDelete={handlePageDelete}
      onItemMove={handlePageMove}
      onPageUpdate={handlePageUpdate}
      onItemSelect={id => null}
      onItemDoubleClick={handlePageNavigate}
    />
  )
})
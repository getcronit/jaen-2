import {withRedux} from '@internal/redux'
import React from 'react'
import {useStaticData} from '.'
import {IPageConnection} from '../../../connectors'
import {useDynamicRedirect} from '../routing/hooks'

export interface ISiteContext {
  templateLoader: (name: string) => Promise<IPageConnection>
}

export const SiteContext = React.createContext<ISiteContext | undefined>(
  undefined
)

export const SiteProvider: React.FC<{}> = withRedux(({children}) => {
  const data = useStaticData()
  // n to dict
  const templatesPaths = React.useMemo(
    () =>
      data.allFile.nodes.reduce<{[name: string]: string}>((dict, node) => {
        dict[node.name] = node.relativePath
        return dict
      }, {}),
    []
  )

  const templateLoader = async (name: string) => {
    alert(`${___JAEN_TEMPLATES___}/${templatesPaths[name]}`)
    //@ts-ignore
    return (await import(`${___JAEN_TEMPLATES___}/${templatesPaths[name]}`))
      .default
  }

  console.log('🚀 ~ file: jaen.tsx ~ line: 62 ~ JaenProvider ~ JaenProvider')

  useDynamicRedirect()

  return (
    <SiteContext.Provider
      value={{
        templateLoader
      }}>
      {children}
    </SiteContext.Provider>
  )
})

/**
 * Access the SiteContext.
 *
 * @example
 * ```
 * const { jaen } = useSiteContext()
 * ```
 */
export const useSiteContext = () => {
  const context = React.useContext(SiteContext)

  if (context === undefined) {
    throw new Error('useSiteContext must be within SiteContextProvider')
  }

  return context
}

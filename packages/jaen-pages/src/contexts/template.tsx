import {createContext, useContext} from 'react'

import {ResolvedPageType} from '../types'
import {useCMSContext, useCMSPage} from './cms'

// SEO: https://github.com/jlengstorf/gatsby-theme-jason-blog/blob/master/src/components/SEO/SEO.js

export type TemplateContextType = {
  pageId: string
  page: ResolvedPageType
}

export const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
)

export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext)

  if (context === undefined) {
    throw new Error('useTemplateContext must be within TemplateContext')
  }

  return context
}

type TemplateProviderProps = {
  id: string
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  children,
  id,
  ...props
}) => {
  const page = useCMSPage(id)
  const {templates} = useCMSContext()

  const isDynamic = page.dynamic

  const findTemplate = (name: string) => {
    const template = templates.find(t => t.TemplateName === name)

    if (!template) {
      throw new Error(`Template "${name}" not found`)
    }

    return template
  }

  const Template = page.template ? findTemplate(page.template) : null

  return (
    <TemplateContext.Provider value={{pageId: id, page}}>
      {isDynamic && Template ? <Template /> : children}
    </TemplateContext.Provider>
  )
}

export default TemplateProvider
import {GatsbyNode} from 'gatsby'
import path from 'path'
import {JaenPluginOptions} from '../../types'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = (
  {plugins, actions, loaders, stage},
  pluginOptions: JaenPluginOptions
) => {
  const {templates} = pluginOptions

  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, '../../../', 'src'), 'node_modules'],
      alias: {
        '@src': path.resolve(__dirname, '../../../', 'src')
      }
    },
    plugins: [
      plugins.define({
        ___JAEN_TEMPLATES___: JSON.stringify(templates.rootDir)
      })
    ]
  })

  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /canvas/,
            use: loaders.null()
          }
        ]
      }
    })
  }
}

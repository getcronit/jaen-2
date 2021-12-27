require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017'
  }
})

module.exports = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react'
}

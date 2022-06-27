const fs = require('node:fs')
const path = require('node:path')
const EdgeJsPlugin = require('../.eleventy.js')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EdgeJsPlugin, {
    extendEdgeInstance: async function (edge, eleventyUserConfig) {
      edge.registerTag({
        block: false,
        seekable: true,
        tagName: 'rawInclude',
        compile (parser, buffer, token) {
          const fileName = token.properties.jsArg.trim()
          const fullPath = path.join(process.cwd(), eleventyUserConfig.dir.input, fileName)
          const fileContent = fs.readFileSync(fullPath, 'utf-8')
          buffer.outputRaw(fileContent)
        }
      })
    },

    skipRenderCondition: function (inputContent, inputPath) {
      return inputPath.includes('components')
    }
  })

  return {
    dir: {
      input: 'src',
      layouts: '_layouts'
    }
  }
}
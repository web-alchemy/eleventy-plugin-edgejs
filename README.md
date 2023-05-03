# Eleventy Plugin that adds support Edge.js template engine

This plugin allows to use [Edge.js]((https://github.com/edge-js/edge/)) as template engine for [Eleventy](https://11ty.dev).

## Installation

```
npm install @web-alchemy/eleventy-plugin-edgejs
```

## Usage

```javascript
const EdgeJsPlugin = require('@web-alchemy/eleventy-plugin-edgejs')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EdgeJsPlugin, {
    // you can extend current edge instance
    extendEdgeInstance: async function (edge, eleventyUserConfig) {
      edge.global('version', '1.0.0')

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

    // ... or create own new edge instance
    createEdgeInstance: async function(eleventyUserConfig) {
      const { Edge } = require('edge.js')
      
      const edge = new Edge({
        cache: false
      })
      
      const { dir } = eleventyUserConfig

      edge.mount(path.join(cwd, dir.input))
      edge.mount('includes', path.join(cwd, dir.input, dir.includes))
      
      return edge
    },

    // optional condition for skipping template rendering
    skipRenderCondition: function (inputContent, inputPath) {
      return inputPath.includes('components')
    }
  })
}
```

If options has `createEdgeInstance` function, then `extendEdgeInstance` will be ignored.

## Links
- [Edge.js Github Repo](https://github.com/edge-js/edge/)
- [Edge.js docs](https://docs.adonisjs.com/guides/views/introduction)
- [Edge.js references](https://docs.adonisjs.com/reference/views/globals/inspect)
- [Eleventy](https://11ty.dev)
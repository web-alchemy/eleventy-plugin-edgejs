const path = require('node:path')
const {
  Edge,
  default: defaultEdgeInstance
} = require('edge.js')
const { Supercharged: EdgeSuperCharged } = require('edge-supercharged')

function initDefaultEdgeInstance(edge, eleventyUserConfig) {
  const cwd = process.cwd()
  const { dir } = eleventyUserConfig

  edge.mount(path.join(cwd, dir.input))
  edge.mount('includes', path.join(cwd, dir.input, dir.includes))
  edge.mount('layouts', path.join(cwd, dir.input, dir.layouts))

  const supercharged = new EdgeSuperCharged()
  edge.use(supercharged.wire, {
    recurring: process.env.NODE_ENV === 'development'
  })
}

function createExtension(userOptions = {}) {
  let edgeInstance = null

  return  {
    outputFileExtension: 'html',

    init: async function () {
      if (typeof userOptions.createEdgeInstance === 'function') {
        edgeInstance = await userOptions.createEdgeInstance(this.config)
        return
      } else {
        await initDefaultEdgeInstance(defaultEdgeInstance, this.config)

        if (typeof userOptions.extendEdgeInstance === 'function') {
          await (userOptions.extendEdgeInstance(defaultEdgeInstance, this.config))
        }

        edgeInstance = defaultEdgeInstance
      }
    },

    compile: async function (inputContent, inputPath) {
      const hasSkipRenderCondition = typeof userOptions.skipRenderCondition === 'function'
      if (hasSkipRenderCondition) {
        const shouldSkip = await userOptions.skipRenderCondition.apply(this, [
          inputContent,
          inputPath,
          this.config
        ])
        if (shouldSkip) {
          // just return `undefined` when this fix will be available
          // https://github.com/11ty/eleventy/pull/2358
          return () => {}
        }
      }

      return async function (data) {
        const content = await edgeInstance.renderRaw(inputContent, data)
        return content
      }
    }
  }
}

module.exports = function(eleventyConfig, userOptions = {}) {
  eleventyConfig.addTemplateFormats('edge')
  eleventyConfig.addExtension('edge', createExtension(userOptions))
}
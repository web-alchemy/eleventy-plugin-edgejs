module.exports = {
  layout: 'main.edge',

  eleventyComputed: {
    permalink: function (data) {
      const { fileSlug } = data.page
      return `/articles/${fileSlug}/`
    }
  }
}
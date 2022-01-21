const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        postDetails: resolve(__dirname, 'post-details.html'),
        addEditPost: resolve(__dirname, 'add-edit-post.html'),
      },
    },
  },
})

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

/* const target = 'http://192.168.10.135:8080'
module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/center' : {
        target,
        changeOrigin: true
      }
    }
  }
} */
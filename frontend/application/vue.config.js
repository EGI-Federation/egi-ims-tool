const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pages: {
    index: {
      entry: 'src/main.js',
      title: 'EGI IMS Tools',
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'it',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    }
  }
})


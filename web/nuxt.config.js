const devConfig = {
  ssr: false,

  target: 'static',

  head: {
    title: 'timer',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/css/tailwind.css'
  ],

  plugins: [
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss'
  ],

  modules: [
  ],

  build: {
  }
}

const prodConfig = {
  ...devConfig,

  router: {
    ...devConfig.router,
    base: './',
    mode: 'hash'
  },

  generate: {
    ...devConfig.generate,
    dir: '../app/dist'
  },

  build: {
    ...devConfig.build
  }
}

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

export default config

module.exports = {
  title: 'coda.js',
  description: 'live-coding the moving body',
  head: [
    // ['link', { rel: 'icon', href: `/logo.png` }],
    // ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    // ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    // ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
  ],
  serviceWorker: false,
  themeConfig: {
    repo: 'JulesFrancoise/coda',
    docsDir: 'docs',
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'API Reference',
        link: '/api/',
      },
      {
        text: 'Examples',
        link: '/examples/',
      },
    ],
    sidebar: {
      '/api/': [
        '',
        'coda-audio',
        'coda-max',
        'coda-midi',
        'coda-ml',
        'coda-sensors',
        'coda-ui',
      ],
      '/': [
        '/installation',
        '/guide/',
        '/guide/getting-started',
        // {
        //   title: 'Core Concepts',
        //   collapsable: false,
        //   children: [
        //     '/guide/core-components',
        //     '/guide/input',
        //     '/guide/data',
        //     '/guide/models',
        //     '/guide/training',
        //     '/guide/validation',
        //     '/guide/interaction',
        //   ]
        // },
        '/credits',
      ]
    },
  },
}

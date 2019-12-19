module.exports = {
  title: 'coda.js',
  description: 'live-coding the moving body',
  head: [
    // ['link', { rel: 'icon', href: `/logo.png` }],
    // ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    // ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    // ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['script', { src: '/sandbox.js' }],
  ],
  serviceWorker: false,
  themeConfig: {
    repo: 'JulesFrancoise/coda',
    docsDir: 'docs',
    logo: '/coda-logo.jpg',
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
      {
        text: 'Playground',
        link: 'https://playcoda.netlify.com',
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
        'most-core',
        'misc',
      ],
      '/': [
        '/installation',
        '/guide/',
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '/guide/getting-started',
            '/guide/creating-running-streams',
            '/guide/sonification',
          ]
        },
        '/credits',
      ]
    },
  },
}

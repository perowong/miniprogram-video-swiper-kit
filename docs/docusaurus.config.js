// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Miniprogram-video-components',
  tagline: `An out-of-box miniprogram components kit in video community scenario`,
  url: 'https://i.overio.space/miniprogram-video-components',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Pero Wong', // Usually your GitHub org/user name.
  projectName: 'miniprogram-video-components', // Usually your repo name.

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/perowong/miniprogram-video-components',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/perowong/miniprogram-video-components',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Miniprogram-video-components',
        logo: {
          alt: 'Miniprogram-video-components Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            label: 'Docs',
            to: 'docs/intro',
            position: 'right',
            activeBasePath: 'docs',
            items: [
              { label: 'Getting Started',  to: 'docs/category/getting-started' },
              { label: 'Components - Basics',  to: 'docs/category/components-basics' },
            ]
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          {
            href: 'https://github.com/perowong/miniprogram-video-components',
            label: 'GitHub',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/perowong',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/perowong',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/perowong/miniprogram-video-components',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Miniprogram-video-components@Pero`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      }
    }),
};

module.exports = config;

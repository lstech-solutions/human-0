import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'HUMΛN-Ø Docs',
  tagline: 'Sustainable impact through Web3 technology',
  favicon: 'img/favicon.ico',
  clientModules: [require.resolve('./src/client')],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://human-0.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/documentation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lstech-solutions', // Usually your GitHub org/user name.
  projectName: 'human-0.com', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/lstech-solutions/human-0.com/tree/main/apps/docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'HUMΛN-Ø',
      logo: {
        alt: 'HUMΛN-Ø Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'dropdown',
          position: 'right',
          label: '🌐 Language',
          items: [
            {
              label: '🇺🇸 English',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("en")'
              }
            },
            {
              label: '🇪🇸 Español',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("es")'
              }
            },
            {
              label: '🇩🇪 Deutsch',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("de")'
              }
            },
            {
              label: '🇫🇷 Français',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("fr")'
              }
            },
            {
              label: '🇵🇹 Português',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("pt")'
              }
            },
            {
              label: '🇨🇳 中文',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("zh")'
              }
            },
            {
              label: '🇸🇦 العربية',
              to: 'javascript:void(0)',
              customProps: {
                onClick: 'handleLanguageChange("ar")'
              }
            },
          ],
        },
        {
          href: 'https://human-0.com',
          label: '← Back to Main Site',
          position: 'right',
        },
        {
          href: 'https://github.com/lstech-solutions/human-0.com',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: '/privacy',
            },
            {
              label: 'Terms of Service',
              to: '/terms',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/lstech-solutions/human-0.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'HUMΛN-Ø Main Site',
              href: 'https://human-0.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LSTS SAS. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

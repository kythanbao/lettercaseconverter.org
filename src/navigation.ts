import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Tools',
      links: [
        {
          text: 'Remove Extra Spaces',
          href: getPermalink('/cleanup/remove-extra-spaces'),
        },
        {
          text: 'Reverse Text Generator',
          href: getPermalink('/text/reverse-text-generator'),
        },
      ],
    },
    {
      text: 'Trust',
      links: [
        {
          text: 'Editorial Policy',
          href: getPermalink('/editorial-policy'),
        },
        {
          text: 'Trust Center',
          href: getPermalink('/trust'),
        },
      ],
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Tools',
      links: [
        { text: 'Remove Extra Spaces', href: getPermalink('/cleanup/remove-extra-spaces') },
        { text: 'Reverse Text Generator', href: getPermalink('/text/reverse-text-generator') },
        { text: 'All Tools', href: getPermalink('/tools') },
        { text: 'Search', href: getPermalink('/search') },
      ],
    },
    {
      title: 'Trust',
      links: [
        { text: 'Editorial Policy', href: getPermalink('/editorial-policy') },
        { text: 'Trust Center', href: getPermalink('/trust') },
        { text: 'How We Test Tools', href: getPermalink('/trust/how-we-test-tools') },
        { text: 'Known Limitations', href: getPermalink('/trust/known-limitations') },
        { text: 'Data Handling Summary', href: getPermalink('/trust/data-handling-summary') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
    { text: 'Cookie Policy', href: getPermalink('/cookie-policy') },
    { text: 'US Privacy Notice', href: getPermalink('/us-privacy-notice') },
    { text: 'Do Not Sell or Share', href: getPermalink('/do-not-sell-or-share') },
    { text: 'Privacy Request', href: getPermalink('/privacy-request') },
  ],
  footNote: `
    © 2026 Letter Case Converter. Free online text tools.
  `,
};

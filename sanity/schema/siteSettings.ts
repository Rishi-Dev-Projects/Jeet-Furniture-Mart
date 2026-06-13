export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'adminPassphrase',
      title: 'Admin Passphrase',
      type: 'string',
      description: 'The passphrase used to access the custom admin dashboard.',
    },
  ],
};

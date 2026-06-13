import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import product from './sanity/schema/product';
import testimonial from './sanity/schema/testimonial';
import siteAnalytics from './sanity/schema/siteAnalytics';
import siteSettings from './sanity/schema/siteSettings';

export default defineConfig({
  name: 'default',
  title: 'Jeet Furniture Mart Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: [product, testimonial, siteAnalytics, siteSettings],
  },
});

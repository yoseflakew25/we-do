import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    USER_EMAIL: 'yared@a2sv.org',
    USER_PASSWORD: '12345678',
  },
  projectId: 'ausp9s',
  screenshotsFolder: false, // Disable screenshot generation
});

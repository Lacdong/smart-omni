import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:5174', ...devices['Desktop Chrome'] },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5174', reuseExistingServer: true, timeout: 60_000 },
  reporter: 'list',
})

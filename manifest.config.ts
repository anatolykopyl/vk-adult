import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  .replace(/[^\d.-]+/g, '')
  .split(/[.-]/)

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: 'Vk Adult',
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  permissions: [
    "debugger", 
    "activeTab",
    "storage"
  ],
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      js: ["src/content/index.ts"],
      matches: ["https://vk.com/video*"],
    }
  ],
  action: {
    default_title: "VK Adult",
  }
}))
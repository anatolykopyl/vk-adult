import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  .replace(/[^\d.-]+/g, '')
  .split(/[.-]/)

export default defineManifest(async () => ({
  manifest_version: 3,
  name: 'VK Adult',
  description: 'Возвращает возможность искать видео Вконтакте без ограничений',
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  permissions: [
    "debugger", 
    "activeTab",
    "storage",
  ],
  icons: {
    16: "public/16.png",
    32: "public/32.png",
    48: "public/48.png",
    128: "public/128.png",
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      js: ["src/content/index.ts"],
      matches: ["https://vk.com/*"],
    }
  ],
  action: {
    default_title: "VK Adult",
    default_popup: "src/popup/index.html",
  },
}));

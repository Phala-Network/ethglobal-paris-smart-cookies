import { defineManifest } from "@crxjs/vite-plugin"

export default defineManifest(async (env) => {
  return {
    manifest_version: 3,
    name: "Smart Cookie",
    version: "1.0.0",
    icons: {
      '16': 'src/assets/icon.png',
      '32': 'src/assets/icon.png',
      '64': 'src/assets/icon.png',
      '128': 'src/assets/icon.png',
    },
    web_accessible_resources: [
      {
        "resources": ["src/assets/*"],
        "matches": [
          "https://*.uniswap.org/*",
          "https://opensea.io/*",
          "https://coinmarketcap.com/*",
          "https://lenster.xyz/*",
          "https://*.lenster.xyz/*",
        ],
      }
    ],
    options_page: 'src/pages/options.html',
    action: { "default_popup": "src/pages/popup.html" },
    host_permissions: [
      "https://lenster.xyz/*",
      "https://*.lenster.xyz/*",
      "https://*.uniswap.org/*",
      "https://opensea.io/*",
      "https://coinmarketcap.com/*",
      // "http://127.0.0.1:5173/*",
      "https://browser-extension-with-phat-contract.vercel.app/*",
    ],
    permissions: ["storage", "unlimitedStorage", "activeTab", "scripting"],
    background: {
      service_worker: "src/background/index.js"
    },
    content_scripts: [
      {
        "js": ["src/content-scripts/uniswap.js"],
        "matches": ["https://info.uniswap.org/*"]
      },
      {
        "js": ["src/content-scripts/uniswap.js"],
        "matches": ["https://app.uniswap.org/*"]
      },
      {
        "js": ["src/content-scripts/opensea.js"],
        "matches": ["https://opensea.io/*"],
      },
      {
        "js": ["src/content-scripts/coinmarketcap.js"],
        "matches": ["https://coinmarketcap.com/*"],
      },
      {
        "js": ["src/content-scripts/lenster.js"],
        "matches": ["https://lenster.xyz/*"]
      },
      {
        "js": ["src/content-scripts/smart-cookies.js"],
        "matches": [
          // "http://127.0.0.1:5173/*",
          "https://browser-extension-with-phat-contract.vercel.app/*",
        ]
      },
    ],
    content_security_policy: {
      "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
    }
  }
})

/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  appId: "com.infinitymind.app",
  productName: "Infinity Mind",
  asar: true,
  asarUnpack: [
    "**/node_modules/node-llama-cpp/**/*",
    "**/node_modules/better-sqlite3/**/*"
  ],
  directories: {
    output: "release",
    buildResources: "assets"
  },
  files: [
    "dist/electron/**/*",
    "out/**/*",
    "package.json"
  ],
  win: {
    target: "nsis",
    icon: "assets/icon.ico"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true
  }
};

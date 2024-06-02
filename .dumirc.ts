import { defineConfig } from 'dumi';
import path from 'path';

const cesiumSource = './node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'cesium_demo',
  },
  alias: {
    cesium: path.resolve(__dirname, cesiumSource, 'Cesium'),
    cesiumRoot: path.resolve(__dirname, './node_modules/cesium'),
  },
  define: {
    CESIUM_BASE_URL: '/',
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  styleLoader : {
    esModule : true
  }
});

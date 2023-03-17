import {resolve} from "path";
import {defineConfig, loadEnv} from "vite";
import eslintPlugin from "vite-plugin-eslint";
import uni from "@dcloudio/vite-plugin-uni";
import initTool from "./plugins/vite-plugin-init-tool";
import replaceManifestFun from "./bin/replaceManifest";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default defineConfig(({mode}) => {
  const config = loadEnv(mode, process.cwd());
  console.log("当前node版本=>", process.version);
  console.log("当前v8内核版本=>", process.versions.v8);
  console.log("当前项目运行环境=>", config.VITE_APP_ENV);
  console.log("当前服务环境=>", process.env.NODE_ENV);
  console.log("当前编译目标平台=>", process.env.UNI_PLATFORM);

  const VITE_APP_CONSOLE = config.VITE_APP_CONSOLE ? JSON.parse(config.VITE_APP_CONSOLE) : false;

  // 微信小程序根据打包环境配置APPID
  if (process.env.UNI_PLATFORM === "mp-weixin") {
    replaceManifestFun("mp-weixin.appid", `"${config.VITE_APP_WEIXIN_APPID}"`);
    replaceManifestFun("mp-weixin.navigateToMiniProgramAppIdList", "[]");
    replaceManifestFun("mp-weixin.embeddedAppIdList", "[]");
  }

  // 是否开启日志
  if (config.VITE_APP_CONSOLE) {
    replaceManifestFun("debug", VITE_APP_CONSOLE);
  }

  return {
    server: {
      open: true,
      watch: {
        ignored: ["plugins/**/*.js", "bin/**/*.js", "uploadKey/**/*.key", "dist"],
      },
    },
    esbuild: {
      drop: config.VITE_APP_ENV === "production" ? ["console", "debugger"] : [],
    },
    resolve: {
      alias: [{find: "@", replacement: resolve(__dirname, "src")}],
    },
    plugins: [
      uni(),
      eslintPlugin({
        include: ["src/**/*.js", "src/**/*.vue", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"],
        exclude: ["./node_modules/**"],
        cache: false,
      }),
      initTool(["development", "production"]),
    ],
    transpileDependencies: ["@dcloudio/uni-ui"],
  };
});

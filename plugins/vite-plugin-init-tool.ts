import { execSync } from "child_process";

/**
 * 初始化微信开发者工具
 * @param openToolEnvironment {Array:[string]} 默认小程序环境下打开开发者工具的环境
 * @returns {boolean|{buildEnd(*): void, apply(*, {mode: *}): *, name: string, enforce: string}}
 */
export default function initTool(openToolEnvironment = ["development"]) {
  let isInitTool = false;
  let initTimeFlag: NodeJS.Timeout;
  return {
    name: "initTool",
    enforce: "post",
    apply({ mode }: { mode: string }) {
      const flag = Array.isArray(openToolEnvironment);
      let openToolEnvironmentList = [];
      if (flag) {
        openToolEnvironmentList = openToolEnvironment;
      } else {
        throw new Error(`initTool函数参数应为数组 不是${typeof openToolEnvironment}`);
      }
      // 非 mp-weixin 以及 非development 情况下的
      return openToolEnvironmentList.includes(mode) && process.env.UNI_PLATFORM === "mp-weixin";
    },
    buildEnd(err: never) {
      if (err) return;
      if (!isInitTool) {
        initTimeFlag = setTimeout(() => {
          const result = execSync(`node ./bin/cliServer.js ${process.env.NODE_ENV}`, {
            encoding: "utf-8",
            stdio: "inherit",
          });
          if (result) {
            clearTimeout(initTimeFlag);
            throw result;
          } else {
            clearTimeout(initTimeFlag);
            isInitTool = true;
          }
        }, 500);
      }
    },
  };
}

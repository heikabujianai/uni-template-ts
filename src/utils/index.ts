import {appInfoStore} from "@/store/app";

const appInfo = appInfoStore();

/**
 * 获取数据真实类型
 * @param params
 * @return {string}
 */
export function getRealType(params: unknown): string {
  return Object.prototype.toString.call(params).replace(/\[(\S+) (\S+)\]/, "$2");
}

/**
 * 获取网络状态
 * @returns {Promise<unknown>}
 */
export function getNetworkTypeStatus(): Promise<boolean> {
  const isConnected = appInfo.getConnectedStatus;
  return new Promise(function (resolve, reject) {
    if (isConnected) {
      resolve(isConnected);
    } else {
      uni.getNetworkType({
        success(res) {
          appInfo.setIsConnected(res.networkType !== "none");
          resolve(res.networkType !== "none");
        },
        fail() {
          reject(false);
        },
      });
    }
  });
}

/**
 * 拼接请求地址
 * @param url
 * @param baseUrl
 * @returns {*}
 */
export function formatUrl(url: string, baseUrl: string = import.meta.env.VITE_APP_BASE_URL) {
  if (getRealType(url) !== "String") {
    throw new TypeError("url类型必须为String");
  }
  if (url.indexOf("http") !== -1 || url.indexOf("https") !== -1) {
    return url;
  }
  return baseUrl + url;
}

/**
 * object转query字符串
 * @param obj
 * @return {string}
 */
export function objectToQuery(obj: unknown): string {
  if (getRealType(obj) !== "Object" || isEmpty(obj)) {
    return "";
  }
  return `?${Object.entries(<object>obj)
    .map((value) => value.join("="))
    .join("&")}`;
}

/**
 * query字符串转object
 * @param query
 * @return {{}|{[p: string]: any}|{[p: string]: string}}
 */
export function queryToObject(query: string): AnyObject {
  const url = query.indexOf("?") === -1 ? query : query.split("?")[1];
  if (typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(url);
    return Object.fromEntries(urlSearchParams.entries());
  } else {
    const params = url.replaceAll("&", " ");
    return Object.fromEntries(
      params
        .split(" ")
        .filter((value) => value)
        .map((value) => value.split("="))
    );
  }
}

/**
 * 检查是否为空值 可以检测大部分数据类型  其中weakMap与weakSet不可枚举 不在可检测范围之内
 * @param params 需检测的值
 * @param deep 是否深入检测 默认为false  为true时会检测是否为空字符串  以及对象 数组为空
 * @return {boolean}
 */
export function isEmpty(params: unknown, deep = false): boolean {
  // 值类型为function时不参与为空检测
  if (typeof params === "function") {
    throw new Error("参数类型不可为function");
  }

  // 检测是否为Date类型  是否为Invalid Date
  if (params instanceof Date) {
    return isNaN(params.getTime());
  }

  // 简单检测  除去 undefined  null 以及 NaN外全部返回true
  if (params === void 0 || params === null || (typeof params === "number" && isNaN(params))) {
    return true;
  }
  // 深入检测
  if (deep) {
    // 检测类型是否为object并返回长度  长度为0时 为空  返回true
    if (typeof params === "object") {
      // 检测类型是否为map 或者 set类型 返回keys长度
      if (getRealType(params) === "Set" || getRealType(params) === "Map") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return !params.size;
      }
      // 返回keys长度
      return !Object.keys(params).length;
    }
    return !params;
  }
  return false;
}

/**
 * 清除假值 可清除null  undefined
 * @param params 传入的数据
 * @param deep 是否深层清理 清除空字符串 false 0
 * @return {*}
 */
export function clearEmpty(params: any, deep = false): any {
  if (getRealType(params) !== "Object") {
    return params;
  }
  for (const key in params) {
    if (isEmpty(params[key], false)) {
      delete params[key];
    }
    if (deep) {
      !params[key] && delete params[key];
    }
  }
  return params;
}

import {doLoginHandler} from "@/utils/login";
import {LOGIN_PATH} from "@/config";
import api from "@/api";

// 是否检测已登陆才能使用api
export const CHECK_LOGIN_API = true;
// 检测是否登录关键字
export const CHECK_LOGIN_FILED = "userId";
// 检测api是否登录白名单
export const LOGIN_WHITE_API_LIST: string[] = [api.example];
export const NEED_CHECK_LOGIN_ROUTE: string[] = ["/pages/index/index"];

/**
 * 检测是否登录
 * @param url
 * @returns {boolean}
 */
export function checkLoginUrlHandler(url: string): boolean {
  if (NEED_CHECK_LOGIN_ROUTE.length && NEED_CHECK_LOGIN_ROUTE.includes(url)) {
    if (uni.getStorageSync(CHECK_LOGIN_FILED)) {
      return true;
    } else {
      uni.navigateTo({
        url: LOGIN_PATH,
      });
      return false;
    }
  }
  return true;
}

/**
 * 检测是否登录
 * @param api
 * @returns {boolean}
 */
export function checkLoginApiHandler(api: string): boolean {
  if (!LOGIN_WHITE_API_LIST.length || !LOGIN_WHITE_API_LIST.includes(api)) {
    if (!uni.getStorageSync(CHECK_LOGIN_FILED)) {
      console.log("\n");
      console.error("接口 " + api + " 未登录不可使用");
      console.log("\n");
      doLoginHandler();
      return false;
    }
    return true;
  }
  return true;
}

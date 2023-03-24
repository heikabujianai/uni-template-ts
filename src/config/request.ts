export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// 成功判断值
export const SUCCESS_VALUE = 0;
// 成功判断字段
export const SUCCESS_FILED = "code";
// 接口失败类别字段
export const FAL_FILED = "code";
// message字段
export const MESSAGE_FILED = "message";
// result字段
export const RESULT_FILED = "data";
// 请求失败默认文案
export const FAILED_MESSAGE = "服务器繁忙，请稍后重试！";
// 请求失败默认文案
export const ERROR_MESSAGE = "服务繁忙，请稍后重试！";
// 是否打印详细请求过程
export const CONSOLE_DETAIL = import.meta.env.VITE_APP_ENV !== "production";
// 请求失败错误信息
export const FAIL_CODE_MAP = {
  0: "0-请求超时",
  301: "301-服务器重定向",
  400: "400-参数错误",
  401: "401-认证失败",
  403: "403-暂无权限",
  404: "404-未找到该请求路径",
  500: "500-系统错误",
  501: "501-服务器无法接受请求",
  502: "502-请求错误",
  503: "503-服务不可用",
  504: "504-连接超时",
  505: "505-浏览器http协议无效",
};

// 额外参数
export const EXTRA_DATA: () => DefaultExtraDataInterface = () => ({
  userId: uni.getStorageSync("userId") || void 0,
});
// 额外头部参数
export const EXTRA_HEADER: () => AnyObject = () => ({
  user_id: uni.getStorageSync("userId") || void 0,
  user_token: uni.getStorageSync("userToken") || void 0,
});

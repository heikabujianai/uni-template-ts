export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// 成功判断值
export const SUCCESS_VALUE = true;
// 成功判断字段
export const SUCCESS_FILED = "success";
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

// 额外参数
export const EXTRA_DATA: () => DefaultExtraDataInterface = () => ({
  userId: uni.getStorageSync("userId") || void 0,
});
// 额外头部参数
export const EXTRA_HEADER: () => AnyObject = () => ({
  user_id: uni.getStorageSync("userId") || void 0,
  user_token: uni.getStorageSync("userToken") || void 0,
});

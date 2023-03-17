import {LOGIN_PATH} from "@/config";

/**
 * 执行跳转登录页面操作
 * @param message
 */
export function doLoginHandler(message = "你还未登录或登录已过期，请立即登录！"): void {
  uni.showModal({
    title: "提示",
    content: message,
    showCancel: false,
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: LOGIN_PATH,
        });
      }
    },
  });
}

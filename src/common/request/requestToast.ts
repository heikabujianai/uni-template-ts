import {appInfoStore} from "@/store/app";
import {DEFAULT_TOAST_DURATION} from "@/config";

const appInfo = appInfoStore();

let loadingTimes = 0;

/**
 * showLoading
 * @param option
 */
export function showLoading(option: RequestToastInterface) {
  if (!loadingTimes) {
    uni.showLoading({
      title: option.title,
      mask: true,
      success() {
        appInfo.setIsShow(true);
      }
    });
  }
  ++loadingTimes;
}

/**
 * hideLoading
 */
export function hideLoading() {
  loadingTimes > 0 && --loadingTimes;
  if (!loadingTimes) {
    uni.hideLoading();
    uni.stopPullDownRefresh();
    appInfo.setIsShow(false);
  }
}

/**
 * showToast
 * @param option
 */
export function showToast(option: RequestToastInterface & { success?: () => void; fail?: () => void }) {
  loadingTimes > 0 && --loadingTimes;
  if (!loadingTimes) {
    uni.showToast({
      icon: "none",
      title: option.title,
      mask: true,
      duration: option.duration || DEFAULT_TOAST_DURATION,
      success: () => {
        appInfo.setIsShow(false);
        option.success && typeof option.success === "function" && option.success();
      }
    });
  }
}

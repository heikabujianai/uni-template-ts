import {appInfoStore} from "@/store/app";
import {DEFAULT_TOAST_DURATION} from "@/config";

const appInfo = appInfoStore();

export class RequestToast {
  private loadingTimes: number;

  constructor() {
    this.loadingTimes = 0;
  }

  showLoading(option: RequestToastInterface) {
    if (!this.loadingTimes) {
      uni.showLoading({
        title: option.title,
        mask: true,
        success() {
          appInfo.setIsShow(true);
        }
      });
    }
    ++this.loadingTimes;
  }

  hideLoading() {
    this.loadingTimes > 0 && --this.loadingTimes;
    if (!this.loadingTimes) {
      uni.hideLoading();
      uni.stopPullDownRefresh();
      appInfo.setIsShow(false);
    }
  }

  showToast(option: RequestToastInterface & { success?: () => void; fail?: () => void }) {
    this.loadingTimes > 0 && --this.loadingTimes;
    if (!this.loadingTimes) {
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
}

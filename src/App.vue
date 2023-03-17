<script setup lang="ts">
import {onLaunch, onShow, onHide} from "@dcloudio/uni-app";
import {appInfoStore} from "@/store/app";
import {FORCED_UPDATE} from "@/config";

const appInfo = appInfoStore();
onLaunch(() => {
  console.log("App Launch");

});
onShow((options) => {
  console.log("App Show");
  console.log(options);
  uni.getNetworkType({
    success(res) {
      netStatusFunction(res, true);
      uni.onNetworkStatusChange(function (res) {
        netStatusFunction(res);
      });
    },
    fail() {
      appInfo.setIsConnected(false);
    },
  });
  if (FORCED_UPDATE) {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: "更新提示",
            content: "新版本上线了，请点击确定按钮更新！",
            showCancel: false,
            success: res => {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            },
          });
        });
      }
    });
    updateManager.onUpdateFailed(() => {
      wx.showModal({
        title: "更新提示",
        content: "新版本已上线，请删除当前小程序，重新搜索进入",
        showCancel: false,
      });
    });
  }
});
onHide(() => {
  console.log("App Hide");
});

function netStatusFunction(res, isCheck = false) {
  if (res.isConnected || isCheck) {
    if (res.networkType === "wifi" || res.networkType === "4g" || res.networkType === "5g") {
      appInfo.setIsConnected(true);
    } else {
      appInfo.setIsConnected(false);
    }
  } else {
    appInfo.setIsConnected(res.isConnected);
  }
}
</script>

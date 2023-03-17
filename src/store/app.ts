import {defineStore} from "pinia";

interface AppInfoInterface {
  isConnected: boolean;
  isShow: boolean;
  showTabBar: boolean;
}

const state: AppInfoInterface = {
  isConnected: true,
  isShow: false,
  showTabBar: true,
};

export const appInfoStore = defineStore("appInfo", {
  state: () => {
    return state;
  },
  getters: {
    getConnectedStatus: (state) => state.isConnected,
    getShowStatus: (state) => state.isShow,
    getShowTabBar: (state) => state.showTabBar,
  },
  actions: {
    setIsConnected(status: boolean) {
      this.isConnected = status;
    },
    setIsShow(status: boolean) {
      this.isShow = status;
    },
    setShowTabBar(status: boolean) {
      this.showTabBar = status;
    },
  },
});

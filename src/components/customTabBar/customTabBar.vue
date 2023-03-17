<template>
  <view v-if="showTabBar&&isInRootPage" class="custom-tabBar-container" :style="{background}">
    <view class="custom-tabBar-container-padding ios-safe-bottom" />
    <view class="custom-tab-bar ios-safe-bottom">
      <view v-for="item in rootPage" :key="item.pagePath" class="custom-tab-bar-item" @click="clickHandler(item)">
        <view v-if="item.isIndex" class="index-item" />
        <view class="custom-tab-bar-item-con">
          <image
            :src="activePath === item.pagePath?item.selectedIconPath:item.iconPath"
            class="custom-tab-bar-item-icon"
          />
          <view class="custom-tab-bar-item-text" :class="{active:activePath === item.pagePath}">
            {{ item.text }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {computed, readonly, ref, defineEmits, defineProps} from "vue";
import home from "@/static/images/tabBar/home.png";
import homeSelect from "@/static/images/tabBar/home-select.png";
import person from "@/static/images/tabBar/person.png";
import personSelected from "@/static/images/tabBar/person-selected.png";
import {appInfoStore} from "@/store/app";
import {LOGIN_PATH} from "@/config";

const emit = defineEmits<{
  (e: "tabBarClick", value: string): void
}>();

withDefaults(defineProps<{ background: string }>(), {
  background: "",
});


interface rootPageInterface {
  pagePath: string
  iconPath: string
  selectedIconPath: string
  text: string
}

const routeList = getCurrentPages();
const appInfo = appInfoStore();
const showTabBar = computed(() => appInfo.showTabBar);
const rootPage = readonly<rootPageInterface[]>([
  {
    pagePath: "pages/index/index",
    iconPath: home,
    selectedIconPath: homeSelect,
    text: "首页",
  },
  {
    pagePath: "pages/my/my",
    iconPath: person,
    selectedIconPath: personSelected,
    text: "个人中心",
  }
]);
const isInRootPage = ref<boolean>(false);
const rootPageList: string[] = rootPage.map(value => value.pagePath);
const activePath = ref<string>("");

if (Array.isArray(routeList) && routeList.length) {
  isInRootPage.value = rootPageList.includes(routeList[routeList.length - 1].route as string);
  activePath.value = routeList[routeList.length - 1].route as string;
}

function clickHandler(item) {
  if (activePath.value === item.pagePath) {
    emit("tabBarClick", item.pagePath);
  } else {
    if (!item.checkLogin || uni.getStorageSync("userId")) {
      uni.switchTab({
        url: `/${item.pagePath}`,
      });
    } else {
      uni.navigateTo({
        url: LOGIN_PATH,
      });
    }
  }
}

</script>

<style lang="scss" scoped>
.custom-tabBar-container {
  height: 155rpx;

  .custom-tab-bar {
    width: 100vw;
    height: 108rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 1rpx 20rpx rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;


    .custom-tab-bar-item {
      flex: 1;
      height: 100%;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .custom-tab-bar-item-con {
        box-shadow: none;
        z-index: 1;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .custom-tab-bar-item-icon {
          height: 56rpx;
          width: 56rpx;
        }

        .custom-tab-bar-item-text {
          font-family: 'Source Han Sans CN';
          font-weight: 400;
          font-size: 24rpx;
          text-align: center;
          color: #808188;
        }

        .custom-tab-bar-item-text.active {
          color: #19459A;
        }
      }

    }
  }
}
</style>

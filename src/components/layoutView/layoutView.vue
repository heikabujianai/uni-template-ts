<template>
  <view
    class="layout-container"
    :class="{
      'layout-container-uni-navbar__placeholder': isOverall
    }"
  >
    <view class="bg" :style="{background}" />
    <view class="layout-container-page">
      <template v-if="isCustomNavBar">
        <uni-nav-bar
          class="custom-nav-bar"
          :title="title"
          :left-icon="navBarOptions.leftIcon"
          :left-text="navBarOptions.leftText"
          :right-icon="navBarOptions.rightIcon"
          :right-text="navBarOptions.rightText"
          :color="navBarOptions.color"
          :background-color="navBarOptions.backgroundColor"
          :fixed="navBarOptions.fixed"
          :status-bar="navBarOptions.statusBar"
          :shadow="navBarOptions.shadow"
          :border="navBarOptions.border"
          @click-left="clickLeft"
        >
          <template #left>
            <slot name="left">
              <view v-if="navBarOptions.leftIcon" class="uni-navbar__content_view">
                <uni-icons :color="navBarOptions.color" :type="navBarOptions.leftIcon" size="20" />
              </view>
              <view
                v-if="navBarOptions.leftText" :class="{ 'uni-navbar-btn-icon-left': !navBarOptions.leftIcon }"
                class="uni-navbar-btn-text"
              >
                <text :style="{ color: navBarOptions.color, fontSize: '12px' }">
                  {{ navBarOptions.leftText }}
                </text>
              </view>
            </slot>
          </template>

          <template #default>
            <view class="uni-navbar__header-container-inner">
              <slot name="title">
                <text class="uni-nav-bar-text uni-ellipsis-1" :style="{ color: navBarOptions.color }">
                  {{ title }}
                </text>
              </slot>
            </view>
          </template>
        </uni-nav-bar>
      </template>
      <view class="layout-content">
        <slot />
        <custom-tab-bar :background="background" @tab-bar-click="tabBarClick" />
        <view class="ios-safe-bottom" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import CustomTabBar from "@/components/customTabBar/customTabBar.vue";
import {computed, watch, nextTick, defineEmits, getCurrentInstance} from "vue";
import {INDEX_PATH} from "@/config";

const instance = getCurrentInstance();


const emit = defineEmits<{
  (e: "navBarHeightHandler", value: number): void
  (e: "tabBarClick", value: string): void
}>();

interface navBarPropsInterface {
  leftIcon?: string | undefined;
  leftText?: string | undefined;
  rightIcon?: string | undefined;
  rightText?: string | undefined;
  color?: string;
  backgroundColor?: string;
  fixed?: boolean;
  statusBar?: boolean;
  shadow?: boolean;
  border?: boolean;
}

interface LayoutViewInterface {
  // 是否启用自定义导航栏
  isCustomNavBar?: boolean;
  // 自定义导航栏配置
  navBarProps?: navBarPropsInterface;
  // 页面标题
  title?: string;
  // 主体内容是否全覆盖
  isOverall?: boolean;
  background?: string;
}

const props = withDefaults(defineProps<LayoutViewInterface>(), {
  isCustomNavBar: false,
  background: "#FFFFFF",
  navBarProps: () => ({
    leftIcon: undefined,
    leftText: undefined,
    rightIcon: "",
    rightText: "",
    color: "#000000",
    backgroundColor: "#FFFFFF",
    fixed: true,
    statusBar: true,
    shadow: false,
    border: false,
  }),
  title: "",
  isOverall: false,
});

const navBarOptions = computed(() => {
  if (props.isCustomNavBar) {
    const result: navBarPropsInterface = Object.assign(
      {
        leftIcon: void 0,
        leftText: void 0,
        rightIcon: "",
        rightText: "",
        color: "#000000",
        backgroundColor: "#FFFFFF",
        fixed: true,
        statusBar: true,
        shadow: false,
        border: false,
      },
      props.navBarProps
    );
    // #ifdef MP-WEIXIN
    delete result.rightIcon;
    delete result.rightText;
    // #endif
    if (props.isOverall) {
      result.backgroundColor = "transparent";
    }
    return result;
  }
  return {};
});


watch(
  () => props.title,
  (value) => {
    if (!props.isCustomNavBar && value) {
      nextTick(() => {
        uni.setNavigationBarTitle({
          title: value,
        });
      });
    }
  },
  {immediate: true}
);
if (props.isCustomNavBar && props.isOverall) {
  const info = uni.createSelectorQuery().in(instance).select(".custom-nav-bar");
  info.boundingClientRect((data) => {
    if (!Array.isArray(data) && data.height) {
      emit("navBarHeightHandler", data.height);
    }
  }).exec();
}

const clickLeft = () => {
  uni.navigateBack({
    delta: 1,
    fail() {
      uni.switchTab({
        url: INDEX_PATH,
      });
    },
  });
};
const tabBarClick = (path) => {
  emit("tabBarClick", path);
};
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  min-height: 100%;
  font-size: 32rpx;

  .bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .layout-container-page {
    height: 100%;
    width: 100%;
    background: transparent;
    position: relative;
  }

  .layout-content {
    height: 100%;
    width: 100%;
    background: transparent;
  }

  .layout-content-fixed {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    overflow: auto;
    background: transparent;
  }
}

.pointer-events {
  pointer-events: none !important;
}

.uni-navbar__header-container-inner {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  overflow: hidden;
}

.uni-nav-bar-text {
  font-size: 28rpx;
}

.uni-navbar-btn-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  line-height: 12px;
}

.uni-ellipsis-1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.uni-nav-bar-right-text {
  font-size: 24rpx;
}
</style>

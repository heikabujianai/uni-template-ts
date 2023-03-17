import {ref} from "vue";

export function useTouch() {
  // 被组合式函数封装和管理的状态
  const systemInfo = uni.getSystemInfoSync();
  const rpxTranslate = 750 / systemInfo.windowWidth;
  const maxHeight = systemInfo.windowHeight * rpxTranslate - 283; // 最大高度屏幕减去tabbar高度和自身高度
  const x = ref<number>(systemInfo.windowWidth * rpxTranslate - 143);
  const y = ref<number>(systemInfo.windowHeight * rpxTranslate - 300);

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = getX(event.pageX);
    y.value = getY(event.pageY);
  }

  function getX(pageX) {
    if (pageX * rpxTranslate > 686) {
      return 622;
    }
    if (pageX * rpxTranslate <= 64) {
      return 0;
    }

    return pageX * rpxTranslate - 64;
  }

  function getY(pageY) {
    if (pageY * rpxTranslate > maxHeight) {
      return maxHeight;
    }
    if (pageY * rpxTranslate <= 64) {
      return 0;
    }

    return pageY * rpxTranslate - 64;
  }

  // 通过返回值暴露所管理的状态
  return {x, y, update};
}

<template>
  <view
    v-show="modelValue" class="address-container ios-safe-bottom"
    :class="{'address-container-show':addressContainerShow}"
  >
    <view class="header-container">
      <view class="padding" :style="{height:paddingHeight}" />
      <view class="header">
        <text class="address">
          {{ address }}
        </text>
        <image src="./close.png" class="close" @click="close" />
      </view>
    </view>
    <view class="address-list-container" :style="{height:`calc(100vh - ${headerHeight}px - ${footerHeight}px)`}">
      <scroll-view scroll-y="true" class="scroll province">
        <view class="item" @click="chooseProvince('')">
          <text class="province-item unlimited">
            不限省
          </text>
        </view>
        <view v-for="(item,index) in provinceList" :key="index" class="item" @click="chooseProvince(item)">
          <text class="province-item" :class="{active:item.provinceCode === provinceCode}">
            {{ item.provinceName }}
          </text>
        </view>
      </scroll-view>
      <scroll-view scroll-y="true" class="scroll city">
        <view class="item" @click="chooseCity('')">
          <text class="city-item unlimited">
            不限市
          </text>
        </view>
        <view v-for="(item,index) in cityList" :key="index" class="item" @click="chooseCity(item)">
          <text class="city-item" :class="{active:item.cityCode === cityCode}">
            {{ item.cityName }}
          </text>
        </view>
      </scroll-view>
      <scroll-view scroll-y="true" class="scroll area">
        <view class="item" @click="chooseArea('')">
          <text class="area-item unlimited">
            不限区域
          </text>
        </view>
        <view v-for="(item,index) in areaList" :key="index" class="item" @click="chooseArea(item)">
          <text class="area-item" :class="{active:item.countryCode === countryCode}">
            {{ item.countryName }}
          </text>
        </view>
      </scroll-view>
    </view>
    <view class="footer">
      <view class="reset" @click="reset">
        恢复默认
      </view>
      <view class="submit" @click="submit">
        完成
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import provinceJson from "./district.json";
import {defineEmits, ref, defineProps, watch, getCurrentInstance, nextTick} from "vue";
import {appInfoStore} from "@/store/app";

interface areaListInterface {
  countryCode: string
  countryName: string
  firstNameLetter: string
}

interface cityListInterface {
  cityCode: string
  cityName: string
  firstNameLetter: string
  areaList: areaListInterface[]
}

interface provinceListInterface {
  provinceCode: string
  provinceName: string
  firstNameLetter: string
  cityList: cityListInterface[]
}

const instance = getCurrentInstance();
const appInfo = appInfoStore();
const addressCodeList = uni.getStorageSync("addressCode");
const addressContainerShow = ref<boolean>(false);
const headerHeight = ref<number>(0);
const footerHeight = ref<number>(0);
const address = ref<string>(uni.getStorageSync("addressText") || "全部区域");
const provinceList = ref<provinceListInterface[]>(provinceJson as provinceListInterface[]);
const provinceCode = ref<string>("");
const cityList = ref<cityListInterface[]>(provinceList.value[0].cityList);
const cityCode = ref<string>("");
const areaList = ref<areaListInterface[]>(cityList.value[0].areaList);
const countryCode = ref<string>("");
if (addressCodeList) {
  provinceCode.value = addressCodeList[0];
  cityCode.value = addressCodeList[1];
  countryCode.value = addressCodeList[2];
}

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "addressSubmit", value: { code: string[], address: string }): void
}>();

const props = withDefaults(defineProps<{
  paddingHeight: string
  modelValue: boolean
}>(), {
  modelValue: false,
});

watch(() => props.modelValue, value => {
  appInfo.setShowTabBar(!value);
  if (!headerHeight.value) {
    uni.createSelectorQuery().in(instance).select(".header-container").boundingClientRect((data) => {
      if (!Array.isArray(data) && data.height) {
        headerHeight.value = data.height;
      }
    }).exec();
    uni.createSelectorQuery().in(instance).select(".footer").boundingClientRect((data) => {
      if (!Array.isArray(data) && data.height) {
        footerHeight.value = data.height;
      }
    }).exec();
  }
  nextTick(() => {
    addressContainerShow.value = value;
  });
});


/**
 * 选择省
 * @param item
 */
const chooseProvince = (item: provinceListInterface | string) => {
  if (typeof item !== "string") {
    provinceCode.value = item.provinceCode;
    address.value = item.provinceName;
    cityList.value = item.cityList;
    areaList.value = cityList.value[0].areaList;
  } else {
    provinceCode.value = "";
    address.value = "全部区域";
    cityList.value = provinceList.value[0].cityList;
    areaList.value = cityList.value[0].areaList;
  }
  cityCode.value = "";
  countryCode.value = "";
};
/**
 * 选择市
 * @param item
 */
const chooseCity = (item: cityListInterface | string) => {
  if (typeof item !== "string") {
    cityCode.value = item.cityCode;
    address.value = [address.value.split(" ")[0], item.cityName].join(" ");
    areaList.value = item.areaList;
  } else {
    cityCode.value = "";
    address.value = address.value.split(" ")[0];
    areaList.value = cityList.value[0].areaList;
  }
  countryCode.value = "";
};
/**
 * 选择区域
 * @param item
 */
const chooseArea = (item: areaListInterface | string) => {
  if (typeof item !== "string") {
    countryCode.value = item.countryCode;
    address.value = [...address.value.split(" ").slice(0, 2), item.countryName].join(" ");
  } else {
    countryCode.value = "";
    address.value = address.value.split(" ").slice(0, 2).join(" ");
  }
};

/**
 * 关闭地址选择
 */
const close = () => {
  addressContainerShow.value = false;
  appInfo.setShowTabBar(!addressContainerShow.value);
  setTimeout(() => {
    emit("update:modelValue", false);
  }, 300);
};

/**
 * 提交
 */
const submit = () => {
  const code = [provinceCode.value, cityCode.value, countryCode.value];
  emit("addressSubmit", {code, address: address.value});
  uni.setStorageSync("addressCode", code);
  uni.setStorageSync("addressText", address.value);
  close();
};

/**
 * 重置地址
 */
const reset = () => {
  address.value = "全部区域";
  cityList.value = provinceList.value[0].cityList;
  areaList.value = cityList.value[0].areaList;
  provinceCode.value = "";
  cityCode.value = "";
  countryCode.value = "";
  submit();
};

</script>

<style lang="scss" scoped>
.address-container {
  background: #FFFFFF;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  position: fixed;
  left: 100vw;
  top: 0;
  z-index: 99;
  transition: left 300ms linear;

  .header-container {
    .padding {
      width: 100%;
    }

    .header {
      width: 100%;
      height: 96rpx;
      background: #FFFFFF;
      padding: 24rpx 40rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #DEE3F0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .address {
        flex: 1;
        font-family: 'Source Han Sans CN';
        font-weight: 500;
        font-size: 32rpx;
        color: #3C4761;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 30rpx;
      }

      .close {
        height: 48rpx;
        width: 48rpx;
      }
    }
  }


  .address-list-container {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .scroll {
      flex: 1;
      height: 100%;
      padding: 20rpx 0;
      box-sizing: border-box;
      font-family: 'Source Han Sans CN';
      font-weight: 400;
      font-size: 28rpx;
      text-align: center;
    }

    .unlimited {
      color: #19459A;
    }

    .province {
      background: #F4F6F8;
      color: #3C4761;
    }

    .item {
      padding: 0 20rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20rpx;
    }

    .province-item, .city-item, .area-item {
      padding: 12rpx 25rpx;
    }

    .active {
      color: #3975F9;
      background: rgba(57, 117, 249, 0.18);
      border-radius: 12rpx;

    }

  }

  .footer {
    width: 100%;
    height: 150rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    left: 0;

    .reset {
      width: 270rpx;
      line-height: 88rpx;
      font-family: 'Source Han Sans CN';
      font-weight: 500;
      font-size: 28rpx;
      text-align: center;
      color: #19459A;
      background: #F4F6F8;
      border-radius: 12rpx;
    }

    .submit {
      line-height: 88rpx;
      width: 393rpx;
      font-family: 'Source Han Sans CN';
      font-weight: 500;
      font-size: 28rpx;
      text-align: center;
      color: #FFFFFF;
      background: #3975F9;
      border-radius: 12rpx;
    }
  }
}

.address-container-show {
  left: 0;
}
</style>

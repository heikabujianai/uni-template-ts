import {STORAGE_DESCRIPTION} from "@/config/storage";
import {formatStorageData, formatStorageKey} from "@/utils/storage";

/**
 * 先保存原有方法
 * @type {(key: string, value: any) => void}
 */
const setStorage = uni.setStorageSync;
const getStorage = uni.getStorageSync;
const removeStorage = uni.removeStorageSync;

/**
 * 重写同步存入缓存
 * @param key
 * @param value
 * @param options
 */
uni.setStorageSync = function (key, value, options = {}) {
  if (!STORAGE_DESCRIPTION[key]) {
    console.error(`请在config文件夹中添加 ${key} 的用途说明`);
  }
  try {
    const _options = Object.assign({expireTime: 0, key, xsbCustom: true, endTimeStamp: Date.now()}, options);
    _options.endTimeStamp = Date.now() + _options.expireTime;
    const _key = formatStorageKey(key);
    const data = formatStorageData(value, _options);
    setStorage(_key, data);
    console.log(`设置缓存 ${key} 成功`);
  } catch (e) {
    console.log(`设置缓存 ${key} 失败`);
    console.log(e);
  }
};

/**
 * 重写同步获取缓存
 * @param key
 * @returns {null|any}
 */
uni.getStorageSync = function (key) {
  if (!STORAGE_DESCRIPTION[key]) {
    console.error(`请在config文件夹中添加 ${key} 的用途说明`);
  }
  try {
    const result = getStorage(formatStorageKey(key));
    console.log(`获取缓存 ${key} 成功`);
    if (result && result.xsbCustom) {
      if (result.expireTime === 0 || result.endTimeStamp >= Date.now()) {
        return result.data;
      } else {
        console.log(`缓存 ${key} 已过期`);
        uni.removeStorageSync(key);
        return null;
      }
    }
    return result;
  } catch (e) {
    console.log(`获取缓存 ${key} 失败`);
    console.log(e);
    return null;
  }
};

/**
 * 重写同步移除缓存
 * @param key
 */
uni.removeStorageSync = function (key) {
  if (!STORAGE_DESCRIPTION[key]) {
    console.error(`请在config文件夹中添加 ${key} 的用途说明`);
  }
  try {
    removeStorage(formatStorageKey(key));
    console.log(`清除缓存 ${key} 成功`);
  } catch (e) {
    console.log(`清除缓存 ${key} 失败`);
    console.log(e);
  }
};

/**
 * 设置异步缓存拦截器
 */
uni.addInterceptor("setStorage", {
  invoke(args) {
    if (!STORAGE_DESCRIPTION[args.key]) {
      console.error(`请在config文件夹中添加 ${args.key} 的用途说明`);
    }
    const _options = Object.assign({expireTime: 0, key: args.key}, args.options);
    _options.endTimeStamp = Date.now() + _options.expireTime;
    args.key = formatStorageKey(args.key);
    args.data = formatStorageData(args.data, _options);
  },
  success(res) {
    console.log(res);
  },
  fail(err) {
    console.log(err);
  },
});

uni.addInterceptor("getStorage", {
  invoke(args) {
    if (!STORAGE_DESCRIPTION[args.key]) {
      console.error(`请在config文件夹中添加 ${args.key} 的用途说明`);
    }
    args.key = formatStorageKey(args.key);
  },
  success(res) {
    const result = res.data;
    if (result && result.xsbCustom) {
      const {expireTime, endTimeStamp} = result;
      if (expireTime === 0 || endTimeStamp >= Date.now()) {
        res.data = result.data;
      } else {
        console.log(`缓存 ${result.key} 已过期`);
        uni.removeStorageSync(result.key);
        res.data = null;
      }
    }
    return res;
  },
  fail(err) {
    console.log(err);
  },
});

uni.addInterceptor("removeStorage", {
  invoke(args) {
    if (!STORAGE_DESCRIPTION[args.key]) {
      console.error(`请在config文件夹中添加 ${args.key} 的用途说明`);
    }
    args.key = formatStorageKey(args.key);
  },
  success(res) {
    console.log(res);
  },
  fail(err) {
    console.log(err);
  },
});

/**
 * errCode 处理函数
 * key值为code码
 *
 */

export const errCodeMessage: ErrMessageInterface = {};
/**
 * errUrl 处理函数
 * key值为url
 *
 */
export const errUrlMessage: ErrMessageInterface = {};

/**
 * 请求失败信息
 * key值为httpCode码
 *
 */
export const failCodeMessage: ErrMessageInterface = {
  523: {
    type: "Toast",
    message: "请检查网络连接",
    duration: 2000,
  },
  500: {
    type: "Toast",
    message: "服务器繁忙，请稍后重试！",
    duration: 2000,
  },
};

/**
 * 请求失败信息
 * key值为url
 *
 */
export const failUrlMessage: ErrMessageInterface = {};

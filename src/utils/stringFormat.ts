import {checkPhoneNumber} from "@/utils/validate";

/**
 * 首字母大写
 * @param str
 * @return {string|*}
 */
export function firstChartToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

/**
 * 字符串转驼峰
 * @param str 字符串
 * @param symbol 标志
 * @returns {string|*}
 */
export function stringTurnHump(str: string, symbol = "-"): string {
  return str
    .split(symbol)
    .map((value, index) => (index > 0 ? firstChartToUpperCase(value) : value))
    .join("");
}

/**
 * css字符串转JS对象
 * @param cssString
 * @returns {{[p: string]: any}|*}
 */
export function stringTurnObjectForCSS(cssString: string): string {
  if (cssString) {
    return Object.fromEntries(
      cssString
        .split(";")
        .map((value) =>
          value
            .split(":")
            .map((val, index) => (index === 0 ? stringTurnHump(val) : val))
        )
    );
  }
  return cssString;
}

/**
 * 手机号脱敏
 * @param phoneNumber
 * @returns {string}
 */
export function formatPhone(phoneNumber: number | string): string {
  const result = checkPhoneNumber(phoneNumber);
  if (result.success) {
    return phoneNumber.toString().replace(/(.{3})(.{4})(.{4})/, "$1****$3");
  }
  return result.message;
}

/**
 * 判断是否有emoji字符
 * @param substring
 * @returns {boolean}
 */
export function isEmojiCharacter(substring: string): boolean {
  let ls;
  for (let i = 0; i < substring.length; i++) {
    const hs = substring.charCodeAt(i);
    if (hs >= 0xd800 && hs <= 0xdbff) {
      if (substring.length > 1) {
        ls = substring.charCodeAt(i + 1);
        const uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
        if (uc >= 0x1d000 && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      ls = substring.charCodeAt(i + 1);
      if (ls === 0x20e3) {
        return true;
      }
    } else {
      if (hs >= 0x2100 && hs <= 0x27ff) {
        return true;
      } else if (hs >= 0x2b05 && hs <= 0x2b07) {
        return true;
      } else if (hs >= 0x2934 && hs <= 0x2935) {
        return true;
      } else if (hs >= 0x3297 && hs <= 0x3299) {
        return true;
      } else if (
        hs === 0xa9 ||
        hs === 0xae ||
        hs === 0x303d ||
        hs === 0x3030 ||
        hs === 0x2b55 ||
        hs === 0x2b1c ||
        hs === 0x2b1b ||
        hs === 0x2b50
      ) {
        return true;
      }
    }
  }
  return false;
}

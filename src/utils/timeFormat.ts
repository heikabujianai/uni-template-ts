import {WEEK_ENUM} from "@/enum";

/**
 * 时间转指定格式
 * @param time
 * @param format
 * @returns {string}
 */
export const formatTime = (time: string | Date | number = new Date(), format = "YYYY-mm-dd HH:MM:SS"): string => {
  let ret: RegExpExecArray | null, date: Date, temp: string;
  if (typeof time === "string") {
    date = new Date(time.replaceAll("-", "/"));
  } else if (typeof time === "number") {
    if (time.toString().length === 10) {
      date = new Date(time * 1000);
    } else {
      date = new Date(time);
    }
  } else {
    date = new Date(time);
  }
  const opt = {
    Y: date.getFullYear().toString(), // 年
    m: (date.getMonth() + 1).toString(), // 月
    d: date.getDate().toString(), // 日
    H: date.getHours().toString(), // 时
    M: date.getMinutes().toString(), // 分
    S: date.getSeconds().toString(), // 秒
  };
  for (const k in opt) {
    ret = new RegExp("(" + k + "+)").exec(format);
    if (ret) {
      temp = ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"); //根据复数前面是否补零,如“mm”补零，单“m”前面不补零
      format = format.replace(ret[1], temp); //替换
    }
  }
  return format;
};

/**
 * 获取周几
 * @param time
 * @param type
 */
export function getWeek(time: string | Date | number = new Date(), type: "number" | "string"): string | number {
  let date: Date;
  if (typeof time === "string") {
    date = new Date(time.replaceAll("-", "/"));
  } else if (typeof time === "number") {
    date = new Date(time);
  } else {
    date = new Date(time);
  }
  if (type === "string") {
    return WEEK_ENUM[date.getDay()];
  } else {
    return date.getDay();
  }
}

/**
 * 比较日期大小
 * @param time
 * @param time2
 */
export function compareDate(time, time2) {
  const date: Date = new Date(time.replaceAll("-", "/"));
  const date2: Date = new Date(time2.replaceAll("-", "/"));
  return date.getTime() > date2.getTime();
}

/**
 * 身份证号码校验
 * @param idCardNumber
 * @returns {{success: boolean, message: string}}
 */
export function checkIDCard(idCardNumber: string): { message: string; success: boolean } {
  if (idCardNumber) {
    const message = {
      success: false,
      message: "身份证号码验证通过",
    };
    const format = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0\d|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/;
    // 号码规则校验
    const result = format.test(idCardNumber);
    if (!result) {
      message.message = "身份证号格式错误";
      return message;
    }
    // 区位码校验
    // 出生年月日校验   前正则限制起始年份为1900;
    const year = idCardNumber.substr(6, 4); // 身份证年
    const month = idCardNumber.substr(10, 2); // 身份证月
    const date = idCardNumber.substr(12, 2); // 身份证日
    const time = Date.parse(month + "-" + date + "-" + year); // 身份证日期时间戳date
    const now_time = Date.now(); // 当前时间戳
    const dates = new Date(Number(year), Number(month), 0).getDate(); // 身份证当月天数
    if (time > now_time || Number(date) > dates) {
      message.message = "身份证号出生日期错误";
      return message;
    }
    // 校验码判断
    const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 系数
    const b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; // 校验码对照表
    const array = idCardNumber.split("");
    let sum = 0;
    for (let k = 0; k < 17; k++) {
      sum += parseInt(array[k]) * c[k];
    }
    if (array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
      message.message = "身份证号检验码错误";
      return message;
    }
    message.success = true;
    return message;
  } else {
    return {
      success: false,
      message: "请正确输入证件号码",
    };
  }
}

/**
 * 手机号码校验
 * @param phoneNumber
 * @returns {{success: boolean, message: string}}
 */
export function checkPhoneNumber(phoneNumber: string | number): { message: string; success: boolean } {
  if (phoneNumber) {
    const message = {
      success: false,
      message: "手机号码格式错误",
    };
    // 号码规则校验
    const result = /^1[3456789]\d{9}$/.test(phoneNumber.toString());
    if (result) {
      message.success = true;
      message.message = "手机号码验证通过";
    }
    return message;
  } else {
    return {
      success: false,
      message: "请正确输入电话号码",
    };
  }
}

/**
 * 邮箱校验
 * @param email
 * @returns {{success: boolean, message: string}}
 */
export function checkEmail(email: string): { message: string; success: boolean } {
  if (email) {
    const message = {
      success: false,
      message: "邮箱格式错误",
    };
    const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    if (result) {
      message.success = true;
      message.message = "邮箱验证通过";
    }
    return message;
  } else {
    return {
      success: false,
      message: "请正确输入邮箱",
    };
  }
}

/**
 * 验证中文姓名
 * @param name
 * @returns {{success: boolean, message: string}}
 */
export function checkChineseName(name: string): { message: string; success: boolean } {
  if (name) {
    const message = {
      success: false,
      message: "请输入中文姓名",
    };
    const result = /^(?:[\u4e00-\u9fa5·]{2,16})$/.test(name);
    if (result) {
      message.success = true;
      message.message = "中文姓名验证通过";
    }
    return message;
  } else {
    return {
      success: false,
      message: "请正确输入姓名",
    };
  }
}

/**
 * 验证字符串是否为中文
 * @param str
 * @returns {{success: boolean, message: string}}
 */
export function checkChinese(str: string): { message: string; success: boolean } {
  if (str) {
    const message = {
      success: false,
      message: "非中文",
    };
    const result = /^[\u4E00-\u9FA5]+$/.test(str);
    if (result) {
      message.success = true;
      message.message = "中文验证通过";
    }
    return message;
  } else {
    return {
      success: false,
      message: "请正确输入字符",
    };
  }
}

/**
 * 检测是否为字母
 * @param str
 * @returns {{success: boolean, message: string}}
 */
export function checkLetter(str: string): { message: string; success: boolean } {
  if (str) {
    const message = {
      success: false,
      message: "非字母",
    };
    const result = /^[a-zA-Z]+$/.test(str);
    if (result) {
      message.success = true;
      message.message = "字母验证通过";
    }
    return message;
  } else {
    return {
      success: false,
      message: "请正确输入字符",
    };
  }
}

/**
 * 检测是否为金额字符串
 * @param money
 * @returns {{success: boolean, message: string}}
 */
export function checkMoney(money: string | number): { message: string; success: boolean } {
  const message = {
    success: false,
    message: "请输入正确的金额",
  };
  const result = /^-?\d+(,\d{3})*(\.\d{1,2})?$/.test(money.toString());
  if (result) {
    message.success = true;
    message.message = "金额验证通过";
  }
  return message;
}

/**
 * 验证是否为数字字符串或者数字
 * @param number
 * @returns {{success: boolean, message: string}}
 */
export function checkNumber(number: number | string): { message: string; success: boolean } {
  const message = {
    success: false,
    message: "非数字",
  };
  const result = /^\d+(\.\d+)?$/.test(number.toString());
  if (result) {
    message.success = true;
    message.message = "数字验证通过";
  }
  return message;
}

/**
 * 验证是否为整数或者整数字符串
 * @param number
 * @returns {{success: boolean, message: string}}
 */
export function checkInteger(number: number | string): { message: string; success: boolean } {
  const message = {
    success: false,
    message: "非整数",
  };
  const result = /^\d+$/.test(number.toString());
  if (result) {
    message.success = true;
    message.message = "整数验证通过";
  }
  return message;
}

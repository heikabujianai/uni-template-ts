/**
 * 保留n为小数
 * @param number 需要保留的数字
 * @param fixedLength {number}保留的位数 默认 2 位
 * @param isRound {boolean}是否四舍五入 默认不进行四舍五入
 * @returns {string}
 */
export function toFixed(number: number, fixedLength = 2, isRound = false): string {
  let num = Number(number);
  const length = fixedLength >= 0 ? fixedLength : 0;
  if (isNaN(num)) num = 0;
  if (isRound) {
    return num.toFixed(length);
  } else {
    const list = num.toString().split(".");
    const len = (list[1] || "").length;
    return [list[0], len >= length ? (list[1] || "").substr(0, length) : (list[1] || "").padEnd(length, "0")].join(".");
  }
}

/**
 * 数字转中文大写
 * @param money
 * @returns {string}
 */
export function convertCurrency(money: string | number): string {
  // 汉字的数字
  const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  // 基本单位
  const cnIntRadice = ["", "拾", "佰", "仟"];
  // 对应整数部分扩展单位
  const cnIntUnits = ["", "万", "亿", "兆"];
  // 对应小数部分单位
  const cnDecUnits = ["角", "分", "毫", "厘"];
  // 整数金额时后面跟的字符
  const cnInteger = "整";
  // 整型完以后的单位
  const cnIntLast = "元";
  // 最大处理的数字
  const maxNum = 999999999999.9999;
  // 金额整数部分
  let integerNum;
  // 金额小数部分
  let decimalNum;
  // 输出的中文金额字符串
  let chineseStr = "";
  // 分离金额后用的数组，预定义
  let parts: string[] = [];
  if (money === "") {
    return "";
  }
  money = parseFloat(money.toString());

  if (money > maxNum) {
    // 超出最大处理数字
    return "";
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  // 转换为字符串
  money = money.toString();
  if (money.indexOf(".") === -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.toString().split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n === "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        // 归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  // 小数部分
  if (decimalNum !== "") {
    const decLen = decimalNum.length;
    for (let qq = 0; qq < decLen; qq++) {
      const ll = decimalNum.substr(qq, 1);
      if (ll !== "0") {
        chineseStr += cnNums[Number(ll)] + cnDecUnits[qq];
      }
    }
  }
  if (chineseStr === "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === "") {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

/**
 * 金额转换千分位格式
 * @param money 需转换的金额
 * @param fixedLength {number|null} 保留几位小数 false 不处理
 * @returns {string|*}
 */
export function convertThousandth(money, fixedLength = null) {
  if (isNaN(Number(money))) {
    return money;
  }
  let _money = Number(money).toString();
  if (typeof fixedLength === "number" && !isNaN(fixedLength)) {
    _money = toFixed(money, fixedLength);
  }
  if (_money.indexOf(".") === -1) {
    return _money.replace(/\B(?=(?:\d{3})+\b)/g, ",");
  }
  return _money.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

/**
 * 分转元
 * @param money
 * @param fixLength {number} 保留几位小数  默认2位
 * @returns {string}
 */
export function centTurnYuan(money, fixLength = 2) {
  if (isNaN(Number(money))) {
    return money;
  }
  return toFixed(money / 100, fixLength);
}

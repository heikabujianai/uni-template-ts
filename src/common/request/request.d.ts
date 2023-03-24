interface DefaultRequestConfigInterface {
  successValue?: string | number | boolean; // 成功code
  successFiled?: string; // 成功code字段
  falFiled?: string; // 失败code字段
  messageFiled?: string; // message字段
  resultFiled?: string; // 结果字段
  failedMessage?: string; // 默认失败文案
  errorMessage?: string; // 默认失败文案
  consoleDetail?: boolean; // 是否打印详细console信息
  showLog?: boolean; // 是否打印console信息
  silent?: boolean; // 是否禁用吐司提示
  showLoading?: boolean; // 是否展示loading
  loadingTitle?: string; // loading显示时的文案
  duration?: number; // toast持续时间
  baseUrl?: string; // 基础地址
  errCodeList?: Array<number | string>; // 错误代码数组
  failCodeMap?: { [key: string | number]: string }; // HTTP错误码
}

interface DefaultRequestInterface<T = AnyObject> {
  url?: string;
  method?:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
  header?: any;
  data?: T;
  config?: DefaultRequestConfigInterface;
  isError?: boolean;
}

interface DefaultExtraDataInterface {
  userId?: string;
}

interface RequestToastInterface {
  title: string;
  duration?: number;
}

/**
 * 初始化参数
 */
interface RequestOptions {
  baseUrl?: string;
  publicKey?: string;
  appKey?: string;
}

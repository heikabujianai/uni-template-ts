import {showLoading, hideLoading, showToast} from "@/common/request/requestToast";
import {clearEmpty, formatUrl, getNetworkTypeStatus, getRealType,} from "@/utils";
import {
  SUCCESS_VALUE,
  SUCCESS_FILED,
  MESSAGE_FILED,
  FAILED_MESSAGE,
  RESULT_FILED,
  ERROR_MESSAGE,
  CONSOLE_DETAIL,
  BASE_URL,
  FAL_FILED,
  EXTRA_DATA,
  EXTRA_HEADER, FAIL_CODE_MAP,
} from "@/config/request";
import {CHECK_LOGIN_API, checkLoginApiHandler} from "@/config/login";
import {appInfoStore} from "@/store/app";

const appInfo = appInfoStore();

export function useRequest(baseUrl: string = BASE_URL) {

  type InterceptorType = {
    response: null | (<T = AnyObject>(options: T) => any)
  }

  type ExtraType = {
    extraData: (<T = AnyObject>() => DefaultExtraDataInterface | T),
    extraHeader: (<T = AnyObject>() => AnyObject | T)
  }

  const interceptor: InterceptorType = {
    response: null
  };

  const extraConfig: ExtraType = {
    extraData: EXTRA_DATA,
    extraHeader: EXTRA_HEADER,
  };

  const defaultConfig: DefaultRequestConfigInterface = {
    baseUrl: baseUrl,
    successValue: SUCCESS_VALUE, // 成功值
    successFiled: SUCCESS_FILED, // 判断接口是否成功字段
    falFiled: FAL_FILED, // 具体失败code字段
    messageFiled: MESSAGE_FILED, // message字段
    resultFiled: RESULT_FILED, // 结果字段
    failedMessage: FAILED_MESSAGE, // 业务请求失败文案
    errorMessage: ERROR_MESSAGE, // 接口请求失败文案
    consoleDetail: CONSOLE_DETAIL, // 是否详细打印
    showLog: true, // 是否打印log
    silent: false, // 是否禁用吐司提示
    showLoading: true, // 是否展示loading
    loadingTitle: "加载中...", // loading显示时的文案
    duration: 2000, // toast持续时间
    errCodeList: [], // 业务错误码数组
    failCodeMap: FAIL_CODE_MAP, // http错误码集合
  };

  function setConfig(options: { config?: DefaultRequestConfigInterface, interceptor?: InterceptorType, extraConfig?: ExtraType }) {
    Object.assign(defaultConfig, options.config);
    Object.assign(interceptor, options.interceptor);
    Object.assign(extraConfig, options.extraConfig);
  }

  async function optionHandler<REQ = AnyObject>(url: string, options: DefaultRequestInterface<REQ>, config?: DefaultRequestConfigInterface): Promise<DefaultRequestInterface<REQ> | AnyObject> {
    const defaultOptions: DefaultRequestInterface<REQ> = Object.assign({url}, options);
    const privateConfig = Object.assign({}, defaultConfig, config);
    defaultOptions.config = privateConfig;
    defaultOptions.config.showLoading && showLoading(<RequestToastInterface>{title: privateConfig.loadingTitle,});
    defaultOptions.config.consoleDetail && console.log(`\n${defaultOptions.url} 函数原始入参 =>`, defaultOptions);
    defaultOptions.config.consoleDetail && console.log(`\n${defaultOptions.url} 接口入参校验开始 =>`, new Date());
    try {
      // 处理网络状态  网络未连接直接退出网络
      const isConnected: boolean = await getNetworkTypeStatus();
      if (!isConnected) {
        uni.showModal({
          title: "提示",
          content: "网络未连接，请连接后重试！",
          showCancel: false,
        });
        throw new Error("网络未连接，请连接后重试！");
      }
      // 前置函数处理
      // if (typeof this.invoke === "function") {
      //   const invokeOptions = this.invoke(_options);
      //   if (invokeOptions) {
      //     Object.assign(_options, invokeOptions);
      //   } else {
      //     throw new Error("前置检测未通过！");
      //   }
      // }
      // 检测URL类型
      if (getRealType(defaultOptions.url) !== "String") {
        throw new TypeError("url must be String");
      }
      // 处置options未设置
      if (getRealType(defaultOptions.data) !== "Object") {
        // console.error("data type must be Object");
        defaultOptions.data = <REQ>{};
      }
      // 新增额外参数
      defaultOptions.data = Object.assign({}, extraConfig.extraData(), options.data);
      // 清除参数中的假值
      defaultOptions.data = clearEmpty(defaultOptions.data);
      // 设置额外头部参数
      defaultOptions.header = Object.assign(
        {
          "Content-Type": "application/json",
        },
        extraConfig.extraHeader(),
        defaultOptions.header
      );
      defaultOptions.header = clearEmpty(defaultOptions.header);
      if (!defaultOptions.method) {
        defaultOptions.method = "POST";
      }
      return defaultOptions;
    } catch (e) {
      console.log(e);
      showToast({title: "参数校验失败"});
      defaultOptions.config.showLoading && hideLoading();
      defaultOptions.config.consoleDetail && console.error(`${defaultOptions.url} 参数校验失败=>`, defaultOptions.url, e);
      defaultOptions.isError = true;
      return defaultOptions;
    }
  }

  /**
   * 日志处理函数
   * @param options
   * @param result
   * @param startTime
   * @param status
   */
  function logHandler<RESP>(options: DefaultRequestInterface<any> | AnyObject, result: RESP | AnyObject | string, startTime: number, status = true) {
    if (import.meta.env.VITE_APP_ENV !== "production") {
      console.log(`\n/////////////////////  ${options.url} 请求结束 日志打印开始////////////////////////`);
      console.log("请求路径 =>", options.url);
      console.log("请求参数 =>", options.data);
      if (status) {
        console.log("请求结果 =>", result);
      } else {
        console.log("请求失败 =>", result);
      }
      let routes: any[] = getCurrentPages();
      console.log("当前页面堆栈=>", (routes = getCurrentPages()));
      console.log("api触发页面路径 =>", routes?.[routes.length - 1] ? routes[routes.length - 1].route : "");
      console.log("处理请求时间 =>", Date.now() - Number(startTime) + "ms");
      console.log(`//////////////////////   ${options.url} 请求结束 日志打印结束///////////////////////\n`);
    }
  }


  async function request<RESP = AnyObject, REQ = AnyObject>(url: string, options: DefaultRequestInterface<REQ>, config?: DefaultRequestConfigInterface): Promise<RESP> {
    let startTime: number | null;
    if (import.meta.env.VITE_APP_ENV === "production") {
      startTime = null;
    } else {
      startTime = Date.now();
    }
    console.log(defaultConfig);
    if (CHECK_LOGIN_API) {
      if (!checkLoginApiHandler(url)) {
        return Promise.reject();
      }
    }
    if (!appInfo.getConnectedStatus) {
      uni.showToast({
        title: "您的网络状况不佳，请稍后重试！",
        mask: false,
        icon: "none",
      });
      return Promise.reject();
    }

    const option: DefaultRequestInterface<REQ> | AnyObject = await optionHandler<REQ>(url, options, config);
    return new Promise((resolve, reject) => {
      if (typeof option.isError === "boolean" && option.isError) {
        option.config.consoleDetail && console.log(`\n${option.url} 请求失败 =>`, new Date());
        reject({[option.config.resultFiled]: option, type: "Error"});
      } else {
        uni.request({
          url: formatUrl(option.url, option.config.baseUrl),
          method: option.method,
          header: option.header,
          data: <AnyObject>option.data,
          success: async (res) => {
            option.config.consoleDetail && console.log("请求成功");
            if (res.statusCode === 200) {
              const result: RESP | AnyObject | string = res.data;
              option.config.showLog && logHandler<RESP>(option, result, Number(startTime));
              const code: string | number | boolean = result[option.config.successFiled];
              if (code === option.config.successValue) {
                option.config.consoleDetail && console.log("进入成功回调");
                option.config.showLoading && hideLoading();
                resolve(<RESP>result[option.config.resultFiled]);
              } else {
                option.config.consoleDetail && console.log("code码非 " + option.config.successValue);
                option.config.consoleDetail && console.log("进入错误code默认处理");
                if (typeof interceptor.response === "function" && option.config.errCodeList.length && option.config.errCodeList.includes(result[option.config.falFiled])) {
                  option.config.showLoading && hideLoading();
                  try {
                    resolve(await interceptor.response<AnyObject>(<AnyObject>result));
                  } catch (e) {
                    console.log(e);
                    reject(e);
                  }
                } else {
                  !option.config.silent && showToast({
                    title: result[option.config.messageFiled] || option.config.errorMessage,
                    duration: option.config.duration,
                  });
                  option.config.silent && option.config.showLoading && hideLoading();
                  reject(<AnyObject>result);
                }
              }
            } else {
              const result = res.data as AnyObject;
              option.config.consoleDetail && console.log("httpCode为" + res.statusCode);
              option.config.consoleDetail && console.log("进入错误http码默认处理");
              !option.config.silent && option.config.showLoading &&
              showToast({
                title: result[option.config.messageFiled] || option.config.failCodeMap[res.statusCode],
                duration: option.config.duration,
              });
              option.config.silent && option.config.showLoading && hideLoading();
              option.config.showLog && logHandler<RESP>(option, result, Number(startTime), false);
              reject(<AnyObject>result);
            }
          },
          fail: (err) => {
            option.config.consoleDetail && console.error("请求失败=>", err);
            option.config.consoleDetail && console.log("进入请求失败默认处理");
            !option.config.silent && showToast({
              title: option.config.failedMessage,
              duration: option.config.duration,
            });
            option.config.silent && option.config.showLoading && hideLoading();
            option.config.showLog && logHandler<RESP>(option, err, Number(startTime), false);
            reject(<AnyObject>err);
          },
          complete: () => {
            uni.stopPullDownRefresh();
          },
        });
      }
    });
  }


  return {
    request,
    setConfig
  };
}

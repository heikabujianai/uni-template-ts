import {RequestToast} from "@/common/request/requestToast";
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
} from "@/config/request";
import {CHECK_LOGIN_API, checkLoginApiHandler} from "@/config/login";
import {appInfoStore} from "@/store/app";

const appInfo = appInfoStore();

/**
 * HTTP请求类
 */
export class Request<DED = DefaultExtraDataInterface> {
  private readonly baseUrl: string;
  private requestToast: RequestToast;
  private isShowMessage: boolean;
  private readonly successValue: string | number | boolean;
  private readonly successFiled: string;
  private readonly falFiled: string;
  public messageFiled: string;
  public resultFiled: string;
  public failedMessage: string;
  public errorMessage: string;
  public consoleDetail: boolean;
  public showLog: boolean;
  public requestInterceptor: null | (<T = AnyObject>(options: DefaultRequestInterface<T>) => DefaultRequestInterface<T>)
  public responseInterceptor: null | (<T = AnyObject>(options: T) => any)
  public specialErrCode: Array<string | number>

  /**
   * 初始化对象
   * @param baseUrl
   */
  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
    this.isShowMessage = false;
    this.requestToast = new RequestToast();
    this.successValue = SUCCESS_VALUE;
    this.successFiled = SUCCESS_FILED;
    this.falFiled = FAL_FILED;
    this.messageFiled = MESSAGE_FILED;
    this.resultFiled = RESULT_FILED;
    this.failedMessage = FAILED_MESSAGE;
    this.errorMessage = ERROR_MESSAGE;
    this.consoleDetail = CONSOLE_DETAIL;
    this.showLog = true;
    this.requestInterceptor = null;
    this.responseInterceptor = null;
    this.specialErrCode = [];
  }

  extraData(): DED | void {
    return void 0;
  }

  extraHeader(): AnyObject | void {
    return void 0;
  }

  /**
   *
   * @param url
   * @param options
   * @param config
   */
  async requestHandler<RESP = AnyObject, REQ = AnyObject>(url: string, options: DefaultRequestInterface<REQ>, config?: DefaultRequestConfigInterface): Promise<RESP> {
    if (CHECK_LOGIN_API) {
      if (!checkLoginApiHandler(url)) {
        return Promise.reject();
      }
    }
    if (!appInfo.getConnectedStatus) {
      console.log(url);
      uni.showToast({
        title: "您的网络状况不佳，请稍后重试！",
        mask: false,
        icon: "none",
      });
      return Promise.reject();
    }
    let startTime: number = Date.now();
    if (import.meta.env.VITE_APP_ENV === "production") {
      startTime = 0;
    }
    const _options: DefaultRequestInterface<REQ> | AnyObject = await this.optionHandler<REQ>(url, options, config);
    return new Promise((resolve, reject) => {
      if (typeof _options.isError === "boolean" && _options.isError) {
        _options.fail && typeof _options.fail === "function" && _options.fail({
          [_options.config.resultFiled]: _options,
          type: "Error",
        });
        _options.config.consoleDetail && console.log(`\n${_options.url} 请求失败 =>`, new Date());
        reject({[_options.config.resultFiled]: _options, type: "Error"});
      } else {
        uni.request({
          url: formatUrl(_options.url, _options.config.baseUrl),
          method: _options.method,
          header: _options.header,
          data: <AnyObject>_options.data,
          success: async (res) => {
            _options.config.consoleDetail && console.log("请求成功");

            if (res.statusCode === 200) {
              const result: RESP | AnyObject | string = res.data;

              this.logHandler<RESP>(_options, result, startTime);

              const code: string | number | boolean = result[_options.config.successFiled];
              if (code === _options.config.successValue) {
                _options.config.consoleDetail && console.log("进入成功回调");
                _options.success && typeof _options.success === "function" && _options.success(<RESP>result[_options.config.resultFiled]);
                _options.config.showLoading && this.requestToast.hideLoading();
                resolve(<RESP>result[_options.config.resultFiled]);
              } else {
                _options.config.consoleDetail && console.log("code码非 " + _options.config.successValue);
                _options.config.consoleDetail && console.log("进入错误code默认处理");
                _options.fail && typeof _options.fail === "function" && _options.fail(<AnyObject>result);

                if (typeof this.responseInterceptor === "function" && [1].includes(result[_options.config.falFiled])) {
                  // console.clear();
                  _options.config.showLoading && this.requestToast.hideLoading();
                  try {
                    resolve(await this.responseInterceptor<AnyObject>(<AnyObject>result));
                  } catch (e) {
                    console.log(e);
                    reject(e);
                  }
                } else {
                  !_options.config.silent && this.requestToast.showToast({
                    title: result[_options.config.messageFiled] || _options.config.errorMessage,
                    duration: _options.config.duration,
                  });
                  _options.config.silent && _options.config.showLoading && this.requestToast.hideLoading();

                  reject(<AnyObject>result);
                }
              }
            } else {
              const result = res.data as AnyObject;
              _options.config.consoleDetail && console.log("httpCode为" + res.statusCode);

              // if (this.failUrlMessageList.length && this.failUrlMessageList.includes(_options.url)) {
              //   _options.config.consoleDetail && console.log("进入特殊url处理");
              //   !this.isShowMessage && this.errorMessageHandler<REQ, RESP>(<RESP | AnyObject>result, _options.url, this.failUrlMessage, _options, resolve, reject);
              // } else if (this.failCodeMessageList.length && this.failCodeMessageList.includes(res.statusCode.toString())
              // ) {
              //   _options.config.consoleDetail && console.log("进入特殊code处理");
              //   !this.isShowMessage && this.errorMessageHandler<REQ, RESP>(<RESP | AnyObject>result, res.statusCode, this.failCodeMessage, _options, resolve, reject);
              // } else {
              _options.config.consoleDetail && console.log("进入错误http码默认处理");
              !_options.config.silent && _options.config.showLoading &&
              this.requestToast.showToast({
                title: result[_options.config.messageFiled] || _options.config.failedMessage,
                duration: _options.config.duration,
              });
              _options.config.silent && _options.config.showLoading && this.requestToast.hideLoading();
              this.logHandler<RESP>(_options, result, startTime, false);
              _options.fail && typeof _options.fail === "function" && _options.fail(<AnyObject>result);
              reject(<AnyObject>result);
              // }
            }
          },
          fail: (err) => {
            _options.config.consoleDetail && console.error("请求失败=>", err);
            _options.config.consoleDetail && console.log("进入请求失败默认处理");
            !_options.config.silent && this.requestToast.showToast({
              title: _options.config.failedMessage,
              duration: _options.config.duration,
            });
            _options.config.silent && _options.config.showLoading && this.requestToast.hideLoading();
            this.logHandler<RESP>(_options, err, startTime, false);
            _options.fail && typeof _options.fail === "function" && _options.fail(err);
            reject(<AnyObject>err);
          },
          complete: (res) => {
            uni.stopPullDownRefresh();
            _options.complete && typeof _options.complete === "function" && _options.complete(res);
          },
        });
      }
    });
  }

  async optionHandler<REQ = AnyObject>(
    url: string,
    options: DefaultRequestInterface<REQ>,
    config?: DefaultRequestConfigInterface
  ): Promise<DefaultRequestInterface<REQ> | AnyObject> {
    const _options: DefaultRequestInterface<REQ> = Object.assign(
      {url},
      options
    );
    _options.config = Object.assign(
      {
        successValue: this.successValue, // 成功code
        successFiled: this.successFiled, // code字段
        messageFiled: this.messageFiled, // message字段
        resultFiled: this.resultFiled, // 结果字段
        falFiled: this.falFiled, // 结果字段
        failedMessage: this.failedMessage, // 默认失败文案
        errorMessage: this.errorMessage, // 默认失败文案
        consoleDetail: this.consoleDetail, // console  配置
        showLog: this.showLog, // console  配置
        baseUrl: this.baseUrl, // url
        silent: false, // 是否禁用吐司提示
        showLoading: true, // 是否展示loading
        loadingTitle: "加载中...", // loading显示时的文案
        duration: 2000, // toast持续时间
        handlerFlag: false, // url
      },
      config
    );
    _options.config.showLoading && this.requestToast.showLoading(<RequestToastInterface>{title: _options.config.loadingTitle,});
    _options.config.consoleDetail && console.log(`\n${_options.url} 函数原始入参 =>`, _options);
    _options.config.consoleDetail && console.log(`\n${_options.url} 接口入参校验开始 =>`, new Date());
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
      if (getRealType(_options.url) !== "String") {
        throw new TypeError("url type must be String");
      }
      // 处置options未设置
      if (getRealType(_options.data) !== "Object") {
        // console.error("data type must be Object");
        _options.data = <REQ>{};
      }
      // 新增额外参数
      _options.data = Object.assign({}, this.extraData(), options.data);
      // 清除参数中的假值
      _options.data = clearEmpty(_options.data);
      // 设置额外头部参数
      _options.header = Object.assign(
        {
          "Content-Type": "application/json",
        },
        this.extraHeader(),
        _options.header
      );
      _options.header = clearEmpty(_options.header);
      if (!_options.method) {
        _options.method = "POST";
      }
      return _options;
    } catch (e) {
      console.log(e);
      this.requestToast.showToast({title: "参数校验失败"});
      _options.config.showLoading && this.requestToast.hideLoading();
      _options.config.consoleDetail && console.error(`${_options.url} 参数校验失败=>`, _options.url, e);
      _options.isError = true;
      return _options;
    }
  }

  /**
   * 出参错误处理
   * @param result
   * @param errKey
   * @param messageList
   * @param options
   * @param resolve
   * @param reject
   */
  errorMessageHandler<REQ = AnyObject, RESP = AnyObject>(
    result: RESP | AnyObject,
    errKey: string | number,
    messageList: AnyObject,
    options: DefaultRequestInterface<REQ> | AnyObject,
    resolve: (value: | (RESP & { successFiled: string; handlerFlag: boolean } & AnyObject) | PromiseLike<RESP & { successFiled: string; handlerFlag: boolean } & AnyObject>) => void,
    reject: (value: RESP | AnyObject) => void
  ) {
    options.config.showLog && console.log("返回结果自定义处理 详见/src/common/request/errMessage.ts");
    options.config.consoleDetail && console.log("开始错误处理");
    const messageConfig: string | AnyObject = messageList[errKey];
    this.isShowMessage = true;
    if (typeof messageConfig === "string") {
      this.requestToast.showToast({
        title: messageConfig,
        duration: options.config.duration,
        success: () => {
          this.isShowMessage = false;
          options.config.consoleDetail && console.log("默认Toast处理,失败函数");
          options.fail && typeof options.fail === "function" && options.fail(<AnyObject>result);
          reject(<AnyObject>result);
        },
      });
    } else {
      // 自定义错误方式回调
      const opt = {
        success: (
          result: RESP & { successFiled: string; handlerFlag: boolean } & AnyObject
        ) => {
          options.config.consoleDetail && console.log("自定义成功函数执行");
          result.successFiled = options.config.successFiled;
          result.handlerFlag = true;
          options.success && typeof options.success === "function" && options.success(result, options.config.successFiled);
          resolve(result);
        },
        fail: (result: AnyObject = {}) => {
          options.config.consoleDetail && console.log("自定义失败函数执行");
          result.successFiled = options.config.successFiled;
          result.handlerFlag = true;
          options.fail && typeof options.fail === "function" && options.fail(result, options.config.successFiled);
          reject(result);
        },
      };

      // 覆盖默认配置
      const conf = Object.assign(
        {
          type: "Modal",
          message: "",
          duration: 2000,
        },
        messageConfig
      );

      if (conf.type === "Toast") {
        this.requestToast.showToast({
          title: typeof result === "string" ? conf.message : conf.message || result[options.config.messageFiled],
          duration: conf.duration,
          success: () => {
            this.isShowMessage = false;
            // 当传入的Handler并且类型为函数时 全面接管函数后续处理 否则还是走failed
            if (conf.handler && typeof conf.handler === "function") {
              options.config.consoleDetail && console.log("Toast自定义处理开始");
              conf.handler && typeof conf.handler === "function" && conf.handler(result, opt);
            } else {
              options.config.consoleDetail && console.log("Toast默认失败处理");
              options.fail && typeof options.fail === "function" && options.fail(result);
              reject(result);
            }
          },
        });
      } else {
        uni.showModal({
          title: "提示",
          content: typeof result === "string" ? conf.message : conf.message || result[conf.config.messageFiled],
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.isShowMessage = false;
              // 当传入的Handler并且类型为函数时 全面接管函数后续处理 否则还是走failed
              if (conf.handler && typeof conf.handler === "function") {
                options.config.consoleDetail && console.log("Modal自定义处理开始");
                conf.handler && typeof conf.handler === "function" && conf.handler(result, opt);
              } else {
                options.config.consoleDetail && console.log("Modal默认失败处理");
                options.fail && typeof options.fail === "function" && options.fail(result);
                reject(result);
              }
            }
          },
        });
      }
    }
  }

  /**
   * 日志处理函数
   * @param options
   * @param result
   * @param startTime
   * @param status
   */
  logHandler<RESP>(
    options: DefaultRequestInterface<any> | AnyObject,
    result: RESP | AnyObject | string,
    startTime: number,
    status = true
  ) {
    options.config.showLog && console.log(`\n/////////////////////  ${options.url} 请求结束 日志打印开始////////////////////////`);
    options.config.showLog && console.log("请求路径 =>", options.url);
    options.config.showLog && console.log("请求参数 =>", options.data);
    if (status) {
      options.config.showLog && console.log("请求结果 =>", result);
    } else {
      options.config.showLog && console.log("请求失败 =>", result);
    }
    let routes: any[] = getCurrentPages();
    options.config.showLog && console.log("当前页面堆栈=>", (routes = getCurrentPages()));
    options.config.showLog && console.log("api触发页面路径 =>", routes?.[routes.length - 1] ? routes[routes.length - 1].route : "");
    options.config.showLog && console.log("处理请求时间 =>", Date.now() - Number(startTime) + "ms");
    options.config.showLog && console.log(`//////////////////////   ${options.url} 请求结束 日志打印结束///////////////////////\n`);
  }
}


// export function useRequest(baseUrl) {
//   const request: Request = new Request(baseUrl);
// }

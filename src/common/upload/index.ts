import {formatUrl} from "@/utils";
import {
  BASE_URL,
  CONSOLE_DETAIL,
  ERROR_MESSAGE,
  EXTRA_DATA,
  EXTRA_HEADER,
  FAILED_MESSAGE,
  FAL_FILED,
  MESSAGE_FILED,
  RESULT_FILED,
  SUCCESS_FILED,
  SUCCESS_VALUE
} from "@/config/request";
import {showLoading, hideLoading, showToast} from "@/common/request/requestToast";

export function useUpload(baseUrl: string = BASE_URL) {
  type ConfigType = {
    successValue: string | number | boolean // 成功code
    successFiled: string // 成功code字段
    falFiled?: string // 失败code字段
    messageFiled: string // message字段
    resultFiled: string // 结果字段
    failedMessage: string // 默认失败文案
    errorMessage: string // 默认失败文案
    consoleDetail: boolean // 是否打印详细console信息
    baseUrl: string
    loadingTitle: string // loading显示时的文案
    header: AnyObject
  }
  type ExtraType = {
    extraData: (<T = AnyObject>() => DefaultExtraDataInterface | T)
    extraHeader: (<T = AnyObject>() => AnyObject | T)
  }

  const config: ConfigType = {
    baseUrl: baseUrl,
    successValue: SUCCESS_VALUE,
    successFiled: SUCCESS_FILED,
    falFiled: FAL_FILED,
    messageFiled: MESSAGE_FILED,
    resultFiled: RESULT_FILED,
    failedMessage: FAILED_MESSAGE,
    errorMessage: ERROR_MESSAGE,
    consoleDetail: CONSOLE_DETAIL,
    loadingTitle: "加载中...", // loading显示时的文案
    header: {}
  };

  const extraConfig: ExtraType = {
    extraData: EXTRA_DATA,
    extraHeader: EXTRA_HEADER,
  };

  function setUploadConfig(option: { config?: ConfigType, extraConfig?: ExtraType }) {
    Object.assign(config, option.config);
    Object.assign(extraConfig, option.extraConfig);
  }

  function uploadResponsesHandler<rep>(res, resolve, reject) {
    console.log("\n文件上传原始出参=>", res.data);
    if (res.statusCode === 200) {
      let result: rep | any;
      try {
        result = JSON.parse(res.data);
      } catch (e) {
        result = res.data || {};
      }
      console.log("\n文件上传出参序列化结果=>", result);
      if (result[config.successFiled] === config.successValue) {
        hideLoading();
        resolve(typeof result === "object" ? <rep>result[config.successFiled] : result);
      } else {
        showToast({
          title: result[config.messageFiled] || config.errorMessage || "上传失败",
        });
        reject(result);
      }
    } else {
      showToast({
        title: config.errorMessage || "服务器繁忙，请稍后重新上传！",
      });
      reject(null);
    }
  }

  function uploadHandler<rep = AnyObject>(url: string, options: DefaultUploadInterface): Promise<rep[]> {
    const fileList: string[] = [];
    if (typeof options.filePath === "string") {
      fileList.push(options.filePath);
    }
    if (Array.isArray(options.filePath)) {
      fileList.push(...options.filePath);
    }
    if (!fileList.length) return Promise.reject("请输入文件地址");
    const uploadList: PromiseLike<rep>[] = fileList.map((value) => {
      return new Promise((resolve, reject) => {
        showLoading({
          title: config.loadingTitle || "上传中...",
        });
        uni.uploadFile({
          url: formatUrl(url, baseUrl),
          filePath: value,
          name: options.name,
          formData: Object.assign({}, extraConfig.extraData(), options.header),
          header: Object.assign({}, extraConfig.extraHeader(), options.header),
          success: (res) => {
            uploadResponsesHandler<rep>(res, resolve, reject);
          },
          fail: (err) => {
            showToast({
              title: config.failedMessage || "上传失败，请稍后重试！",
            });
            reject(err.errMsg);
          }
        });
      });
    });
    return Promise.all(uploadList);
    // return new Promise((resolve, reject) => {
    //   if (typeof options.filePath === "string") {
    //     showLoading({
    //       title: config.loadingTitle || "上传中...",
    //     });
    //     uni.uploadFile({
    //       url: formatUrl(url, baseUrl),
    //       filePath: options.filePath,
    //       name: options.name,
    //       formData: Object.assign({}, extraConfig.extraData(), options.header),
    //       header: Object.assign({}, extraConfig.extraHeader(), options.header),
    //       success: (res) => {
    //         uploadResponsesHandler<rep>(res, resolve, reject);
    //       },
    //       fail: (err) => {
    //         console.log(err);
    //         showToast({
    //           title: "上传失败，请稍后重试！",
    //         });
    //         reject(err.errMsg);
    //       },
    //       complete: () => {
    //         hideLoading();
    //       },
    //     });
    //   } else {
    //     reject("请输入正确的filePath");
    //   }
    // });
  }

  return {
    setUploadConfig,
    uploadHandler
  };
}

import {getRealType, formatUrl} from "@/utils";
import {BASE_URL, EXTRA_HEADER, MESSAGE_FILED, RESULT_FILED} from "@/config/request";
import {RequestToast} from "@/common/request/requestToast";

export class Upload {
  private readonly baseUrl: string;
  private readonly uploadLoading: RequestToast;
  public codeFiled: string;
  public successCode: string | number | boolean;
  public resultFiled: string;
  public messageFiled: string;
  public header: AnyObject;

  constructor(baseUrl = BASE_URL) {
    this.codeFiled = "";
    this.successCode = 0;
    this.resultFiled = RESULT_FILED;
    this.messageFiled = MESSAGE_FILED;
    this.baseUrl = baseUrl;
    this.header = {};
    // 实例化loading
    this.uploadLoading = new RequestToast();
  }

  /**
   * 单文件上传
   * @param options
   * @param baseUrl
   * @returns {Promise<unknown>}
   */
  singleUpload<rep>(options: { url: string, filePath: string, name: string, formData?: AnyObject, header?: AnyObject }, baseUrl = this.baseUrl): Promise<rep> {
    this.uploadLoading.showLoading({
      title: "上传中...",
    });
    console.log(options);
    options.header = Object.assign({}, this.header, EXTRA_HEADER());
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        ...Object.assign({}, options, {url: formatUrl(options.url, baseUrl)}),
        success: (res) => {
          this.uploadResponsesHandler(res, resolve, reject);
        },
        fail: (err) => {
          this.uploadLoading.showToast({
            title: "上传失败，请稍后重试！",
          });
          reject(err.errMsg);
        },
        complete: () => {
          this.uploadLoading.hideLoading();
        },
      });
    });
  }

  /**
   * 多文件上传
   * @param options
   * @param baseUrl
   * @returns {Promise<unknown>|Promise<unknown[]>}
   */
  multiUpload(options, baseUrl = this.baseUrl) {
    this.uploadLoading.showLoading({
      title: "上传中...",
    });
    try {
      if (!options.url || getRealType(options.url) !== "String") {
        throw new TypeError("文件上传路径错误");
      }
      // #ifdef MP-WEIXIN
      if (options.files) {
        throw new Error("小程序不支持files");
      }
      if (!Array.isArray(options.filePath)) {
        throw new TypeError("filePath类型不正确，单文件上传请使用 singleUpload 方法");
      }
      // #endif
      // #ifdef H5
      if (options.filePath && !Array.isArray(options.filePath)) {
        throw new Error("filePath类型不正确，单文件上传请使用 singleUpload 方法");
      }
      if (options.file && getRealType(options.file) !== "File") {
        throw new TypeError("file类型不正确，单文件上传请使用 singleUpload 方法");
      }
      // #endif
      options.header = Object.assign({}, this.header, EXTRA_HEADER());
      if (options.files) {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: formatUrl(options.url, baseUrl),
            files: options.files,
            header: options.header,
            formData: options.formData,
            success: (res) => {
              this.uploadResponsesHandler(res, resolve, reject);
            },
            fail: (err) => {
              this.uploadLoading.showToast({
                title: "上传失败，请稍后重试！",
              });
              reject(err.errMsg);
            },
            complete: () => {
              this.uploadLoading.hideLoading();
            },
          });
        });
      } else {
        this.uploadLoading.hideLoading();
        const uploadList = options.filePath.map((value) => {
          return new Promise((resolve, reject) => {
            this.uploadLoading.showLoading({
              title: "上传中...",
            });
            uni.uploadFile({
              url: formatUrl(options.url, baseUrl),
              filePath: value,
              name: options.name,
              header: options.header,
              formData: options.formData,
              success: (res) => {
                this.uploadResponsesHandler(res, resolve, reject);
              },
              fail: (err) => {
                this.uploadLoading.showToast({
                  title: "上传失败，请稍后重试！",
                });
                reject(err.errMsg);
              }
            });
          });
        });
        return Promise.all(uploadList);
      }
    } catch (e) {
      this.uploadLoading.hideLoading();
    }
  }

  /**
   * 上传出参处理函数
   * @param res
   * @param resolve
   * @param reject
   */
  uploadResponsesHandler(res, resolve, reject) {
    console.log("\n文件上传原始出参=>", res.data);
    if (res.statusCode === 200) {
      let result;
      try {
        result = JSON.parse(res.data);
      } catch (e) {
        result = res.data || {};
      }
      console.log("\n文件上传出参序列化结果=>", result);
      if (result[this.codeFiled] === this.successCode) {
        this.uploadLoading.hideLoading();
        resolve(result[this.resultFiled]);
      } else {
        this.uploadLoading.showToast({
          title: result[this.messageFiled] || "上传失败",
        });
        reject(result);
      }
    } else {
      this.uploadLoading.showToast({
        title: "服务器繁忙，请稍后重新上传！",
      });
      reject(null);
    }
  }
}

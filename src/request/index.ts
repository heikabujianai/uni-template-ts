// 实例化request对象
import {useRequest} from "@/common/request";
import {useUpload} from "@/common/upload";
import {EXTRA_DATA, EXTRA_HEADER, FAL_FILED} from "@/config/request";

const {requestHandler, setRequestConfig} = useRequest();
const {uploadHandler, setUploadConfig} = useUpload();

setRequestConfig({
  extraConfig: {
    extraData: EXTRA_DATA,
    extraHeader: EXTRA_HEADER
  },
  interceptor: {
    response: <any>((options) => {
      console.log("responseInterceptor=>", options);
      if (options[FAL_FILED] === 1) {
        uni.showToast({title: options.message});
        return Promise.resolve({test: 33333333333});
      }
      return Promise.reject({test: 33333333333});
    })
  }
});

setUploadConfig({
  extraConfig: {
    extraData: EXTRA_DATA,
    extraHeader: EXTRA_HEADER
  },
});

export const request = requestHandler;

// 抛出upload对象
export const upload = uploadHandler;

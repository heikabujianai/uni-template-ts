import {Request} from "@/common/request";
import {Upload} from "@/common/upload";
import {EXTRA_DATA, EXTRA_HEADER, FAL_FILED} from "@/config/request";

// 实例化request对象
const instanceRequest = new Request();
instanceRequest.responseInterceptor = <any>((options) => {
  console.log("responseInterceptor=>", options);
  if (options[FAL_FILED] === 1) {
    uni.showToast({title: options.message});
    return Promise.resolve({test: 33333333333});
  }
  return Promise.reject({test: 33333333333});
});
instanceRequest.extraData = EXTRA_DATA;
instanceRequest.extraHeader = EXTRA_HEADER;

// 抛出request函数
export const request = instanceRequest.requestHandler.bind(instanceRequest);
// 抛出upload对象
export const upload = new Upload();

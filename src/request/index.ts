import {Request} from "@/common/request";
import {Upload} from "@/common/upload";
import {EXTRA_DATA, EXTRA_HEADER} from "@/config/request";

// 实例化request对象
const instanceRequest = new Request();
instanceRequest.responseInterceptor = <any>((options) => {
  console.log(options);
  return Promise.reject(options);
});
instanceRequest.extraData = EXTRA_DATA;
instanceRequest.extraHeader = EXTRA_HEADER;

// 抛出request函数
export const request = instanceRequest.requestHandler.bind(instanceRequest);
// 抛出upload对象
export const upload = new Upload();

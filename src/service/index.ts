import {request, upload} from "@/request";
import api from "@/api";

/**
 * banner列表
 * @returns {Promise<*>}
 */
export function example<rep = AnyObject, req = AnyObject>(data: req): Promise<rep> {
  return request<rep, req>(api.example, {data, method: "POST"}, {silent: false});
}

/**
 * banner列表
 * @returns {Promise<*>}
 */
export function uploadExample<rep = AnyObject>(data: DefaultUploadInterface): Promise<rep | rep[]> {
  return upload<rep>(api.example, data);
}

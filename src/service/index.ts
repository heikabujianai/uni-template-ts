import {request} from "@/request";
import api from "@/api";

/**
 * banner列表
 * @returns {Promise<*>}
 */
export function example<rep = AnyObject, req = AnyObject>(data: req): Promise<rep> {
  return request<rep, req>(api.example, {data, method: "POST"}, {silent: false});
}

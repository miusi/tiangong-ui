/*
 * @Description: 
 * @Author: godric
 * @Date: 2020-03-14 12:24:35
 * @LastEditTime: 2020-03-15 15:39:30
 * @LastEditors: godric
 */
import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) { 
  return request('/api/login', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

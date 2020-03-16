/*
 * @Description: token
 * @Author: godric
 * @Date: 2020-03-15 15:53:19
 * @LastEditTime: 2020-03-15 16:10:05
 * @LastEditors: godric
 */
export function getToken() {
  return localStorage.getItem('antd-pro-token');
}

export function setToken(token: string) {
  return localStorage.setItem('antd-pro-token', token);
}

export function clearToken(){
    localStorage.removeItem('antd-pro-token');
}
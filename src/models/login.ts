/*
 * @Description:
 * @Author: godric
 * @Date: 2020-03-14 12:24:35
 * @LastEditTime: 2020-03-15 22:59:15
 * @LastEditors: godric
 */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';

import { fakeAccountLogin } from '@/services/login'; 
import { getPageQuery } from '@/utils/utils';
import { setToken, clearToken, getToken } from '@/utils/token'; 

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: true,
          ...response,
        },
      });
      // Login successfully
      if (response.success === true) {
        const urlParams = new URL(window.location.href);
    
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
      
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            // window.location.href = '/';
            // return;
            redirect = '/';
          }
        }
        console.log(redirect);
        router.push(redirect || '/');
      }
    },
    logout({ payload = {} }, { call, put }) {
     
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload);
      if (payload.status) {
        //登录
        //设置token
        setToken(payload.result.token);
        // setAuthority(payload.currentAuthority);
      } else {
        //登出
        clearToken();
      }
      //reloadAuthorized();
      return {
        ...state,
        // status: payload.status,
        //  type: payload.type,
      };
    },
  },
};

export default Model;

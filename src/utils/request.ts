/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getToken } from './token';

export interface noAuthUrl {
  method: string;
  url: string;
}

const ignoreNotification: noAuthUrl[] = [
  //{ method: 'POST', url: '/api/auth/token' },
  //{ method: 'DELETE', url: '/api/auth/token' },
];

const getUrlRelativePath = (url: string) => {
  var arrUrl = url.split('//');

  var start = arrUrl[1].indexOf('/');
  var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf('?') != -1) {
    relUrl = relUrl.split('?')[0];
  }
  return relUrl;
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  headers: {},
});
request.interceptors.request.use((url, options) => {
  const token = getToken();
  if (url !== '/login') {
    if (token) {
      options.headers.Authorization = 'Bearer ' + token;
    }
  }
  return {
    url,
    options,
  };
});

request.interceptors.response.use((response, options) => {
  if (response.status >= 200 && response.status < 300) {
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
      const _interface = { method: options.method, url: getUrlRelativePath(response.url) };

      if (
        !ignoreNotification.find(
          item => item.method === _interface.method && item.url === _interface.url,
        )
      ) {
        notification.success({
          message: response.msg, //formatMessage({ id: 'form.submit.success' }),
          duration: 1,
        });
      }
    }
  }
  return response;
});

export default request;

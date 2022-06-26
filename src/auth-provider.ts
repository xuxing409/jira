// 在真实环境中，如果使用firebase这种第三方auth服务的话，本文件不需要开发者开发
import { User } from "screens/project-list/search-panel";
// token键名
export const localStorageKey = "__auth_provider_token";
// env 环境常量apiUrl
const apiUrl = process.env.REACT_APP_API_URL;

// 获取token
export const getToken = () => window.localStorage.getItem(localStorageKey);

// 处理response，将用户信息放入localStorage中
export const handelUserResponse = async ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};

// 登录
export const login = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handelUserResponse(await response.json());
    } else {
      return Promise.reject(await response.json()); //Promise.reject 效果类似 throw new error
    }
  });
};
// 注册
export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handelUserResponse(await response.json());
    } else {
      return Promise.reject(await response.json()); //Promise.reject 效果类似 throw new error
    }
  });
};
// 登出
export const logout = async () =>
  window.localStorage.removeItem(localStorageKey);

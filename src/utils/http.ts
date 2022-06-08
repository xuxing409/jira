import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";
import { type } from "os";
import qs from "qs";

const apiUrl = process.env.REACT_APP_API_URL;
// 声明一个接口用于传递data
interface Config extends RequestInit {
  data?: object;
  token?: string;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET", // 默认值，customConfig覆盖
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };
  // 判断method类型,
  // get类型，data放入queryString中(使用qs库快速对象转qs格式)，
  // post类型，data放入body中(注意转json)
  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data);
  }
  // 无论服务端返回什么异常，fetch 都不会抛出异常，只有在断网才会抛出异常
  // axios 和 fetch 表现不一样,axios可以返回状态不为2xx时抛出异常
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登录" });
      }
      const data = await response.json();
      // response.ok 2xx都会返回 true，通过ok属性判断服务器返回状态
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};
// 封装一层hook,用于自动设置token
export const useHttp = () => {
  // 1.获取用户token
  const { user } = useAuth();
  // 使用Parameters Ts操作符 和 typeof（这个和js的typeof（runtime） 不同,是静态的时候运行） 替换和http方法相同的类型
  return (...[endpoint, config]: Parameters<typeof http>) =>
    // 2.设置token
    http(endpoint, {
      ...config,
      token: user?.token,
    });
};

// 类型别名
type FavoriteNumber = string | number;
// 类型别名和interface 在很多情况下可以互换
// interface Person {
//   name: string;
// }
// type Person = { name: string };

// 类型别名， interface在这种情况下没法替代type
// type FavoriteNumber = string | number;

//  interface 无法实现 utility Type

// type Person {
//   name: string,
//   age: number
// }
// const xiaoMing: Partial<Person>= {name:'xiaoming'}

import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";
import qs from "qs";
import { useCallback } from "react";

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
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      // 2.设置token
      http(endpoint, {
        ...config,
        token: user?.token,
      }),
    [user?.token]
  );
};

// 类型别名
// type FavoriteNumber = string | number;
// 类型别名和interface 在很多情况下可以互换
// interface Person {
//   name: string;
// }
// type Person = { name: string };

// 类型别名， interface在这种情况下没法替代type
// type FavoriteNumber = string | number;

//  interface 无法实现 utility Type

// Partial 使用后可以使{}类型中的属性可有可无
// type Partial<T> = { [P in keyof T]?: T[P] };

// type Person = {
//   name: string;
//   age: number;
// };
// const xiaoMing: Partial<Person> = { name: "xiaoming" };

// omit 可以在第二个参数指定要删除的参数，从而形成一个新的类型
// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// const shenMiRen: Omit<Person, "name"> = { age: 8 }; // {age: number}

// keyof 操作符可以用来一个对象中的所有 key 值 组成联合类型
// type PersonKeys = keyof Person; // "name" | "age"

// Pick 从类型定义的属性中，选取指定一组属性，返回一个新的类型定义。
// type Pick<T, K extends keyof T> = {
//   [P in K]: T[P];
// };
// type PersonOnlyName = Pick<Person, "name" | "age">;
// Exclude 从类型 Type 中剔除所有可以赋值给 ExcludedUnion 的属性，然后构造一个类型。
// type Exclude<T, U> = T extends U ? never : T;
// type Age = Exclude<PersonKeys, "name">;

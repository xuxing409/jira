// 本hook 为useSearchParams 的加强函数,能一次获取、设置多个url query参数
import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject } from "utils";
/**
 * 返回页面url中 指定的参数值
 */

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // as { [key in K]: string } 取得泛型的值作为key
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();

  // 返回一个数组(包含两个函数)
  // 第一个函数 遍历hook传递来的 keys 数组,获得 对应url中的值,组成一个对象返回
  // 返回一个设置所有hook的
  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
    },
  ] as const;
};

// 设置url 查询参数 hook
// 返回的函数参数为：键的对象
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  // fromEntries把键值对列表转换为一个对象
  return (params: { [key in string]: unknown }) => {
    console.log("searchParams", searchParams);

    // 覆盖url上的参数
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;

    // 设置url
    return setSearchParam(o);
  };
};

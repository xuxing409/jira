import { useEffect, useState } from "react";

export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
// 用于queryString清除对象中的空值 如 ?list=&
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };

  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
// 模仿onMounted 生命周期钩子
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // TODO依赖项里加上 callback 会无限循环，这个与useCallback 和 useMemo 有关
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
// 防抖钩子
export const useDebounce = <T>(value: T, delay?: number) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    // 每次在value变化后设置一个定时器
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    // 每次再上一个useEffect处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

// export const useDebounce = (fn, delay) => {
//   let timeout;

//   return function (...param) {
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     timeout = setTimeout(function () {
//       fn(...param);
//     }, delay);
//   };
// };

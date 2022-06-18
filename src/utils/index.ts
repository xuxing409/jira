import { useEffect, useState, useRef } from "react";

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

// useRef 返回的对象在整个组件的生命周期保持不变
// 利用这个特性替换闭包实现useDocumentTitle这个hook
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;
  // 页面加载前 旧titile
  // 页面加载后 新title

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // 如果不指定依赖，读取到的title就是组件加载前的title（也就是旧的title）
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};
/**
 *
 * @returns 回到起始路由
 */
export const resetRoute = () => (window.location.href = window.location.origin);

/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载，返回false；反之，返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
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

// useAsync 用于维护loading 和 error信息,
// 很多组件都有请求加载loading状态&也存在加载失败的情况
// 以上情形通过本钩子来统一管理状态
import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils";
interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}
// 默认state
const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

// 默认配置不抛出异常
const defaultConfig = {
  throwOnError: false,
};

// 安全dispatch， 防止组件未挂载或者卸载时 修改组件状态
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

// 使用hook 和 闭包 储存数据
// State<D>作用使用 initialState对象的data 反向推导出D类型
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };

  // useReducer(reducer, initialArg, init)
  // 第一个参数 reducer 是函数 (state, action) => newState，接受当前的 state 和操作行为。
  // 第二个参数 initialArg 是状态初始值。
  // 第三个参数 init 是懒惰初始化函数。
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );

  // 安全dispatch
  const safeDispatch = useSafeDispatch(dispatch);

  // useState传入函数的含义是:惰性初始化(用于耗时的计算,函数内部会直接执行一遍),
  // 所以用useState保存函数,不能直接传入函数
  const [retry, setRetry] = useState(() => () => {});

  // 请求正常时，设置数据
  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: "success",
        error: null,
      }),
    [safeDispatch]
  );

  // 请求异常时，设置异常
  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        stat: "error",
        data: null,
      }),
    [safeDispatch]
  );

  // run 用来触发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      // 如果传递进来的不是promise则返回异常
      if (!promise || !promise.then) {
        throw new Error("请传入Promise 类型数据");
      }

      // 保存刷新函数,setRetry 自动执行第一层;返回函数
      // 这里不能直接使用promise,因为promise是已经拿到结果,而不是拿到执行promise的函数
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      // 设置请求状态为loading   使用函数解决依赖无限刷新
      safeDispatch({ stat: "loading" });

      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          // catch 会消化异常 如果不主动抛出,外面是接收不到异常的
          setError(error);
          if (config.throwOnError) {
            return Promise.reject(error);
          }
          return error;
        });
    },
    [config.throwOnError, safeDispatch, setData, setError]
  );

  return {
    // 返回请求状态
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    // 返回请求的异步包裹函数 用于设置请求状态并存储
    run,
    setData,
    setError,
    // retry 重新跑一边run
    retry,
    // 返回数据
    ...state,
  };
};

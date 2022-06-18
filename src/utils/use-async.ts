// useAsync 用于维护loading 和 error信息,
// 很多组件都有请求加载loading状态&也存在加载失败的情况
// 以上情形通过本钩子来统一管理状态
import { useState } from "react";
import { useMountedRef } from "utils";
interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

// 使用hook 和 闭包 储存数据
// State<D>作用使用 initialState对象的data 反向推导出D类型
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };

  // 函数传递的state覆盖默认state
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

  const mountedRef = useMountedRef();

  // useState传入函数的含义是:惰性初始化(用于耗时的计算,函数内部会直接执行一遍),
  // 所以用useState保存函数,不能直接传入函数
  const [retry, setRetry] = useState(() => () => {});

  // 请求正常时，设置数据
  const setData = (data: D) =>
    setState({
      data,
      stat: "success",
      error: null,
    });

  // 请求异常时，设置异常
  const setError = (error: Error) =>
    setState({
      error,
      stat: "error",
      data: null,
    });

  // run 用来触发异步请求
  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
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
    // 设置请求状态为loading
    setState({ ...state, stat: "loading" });

    return promise
      .then((data) => {
        if (mountedRef.current) setData(data);
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
  };

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

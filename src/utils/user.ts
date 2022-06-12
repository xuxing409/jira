// 本文件用于请求user信息
import { useEffect } from "react";
import { User } from "srceens/project-list/search-panel";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

// 抽离出获取user 的请求
export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();

  const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(client("users", { data: cleanObject(param || {}) }));

    // 依赖项里加上client会无线循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  return result;
};

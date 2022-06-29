// 本文件用于请求user信息
import { useEffect } from "react";
import { useQuery } from "react-query";
import { User } from "types/user";
import { useHttp } from "./http";

// 抽离出获取user 的请求
export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();

  // useQuery（查）第一个参数用数组 数组第一位为存储标识(作为useQuery查询的唯一标识，该值唯一)，
  // 第二位放依赖
  return useQuery<User[]>(["users", param], () =>
    client("users", { data: param })
  );
};

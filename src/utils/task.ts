import { useQuery } from "react-query";
import { Task } from "types/task";
import { useHttp } from "./http";

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();

  // 第一个参数用数组 数组第一位为存储标识，第二位放依赖
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};

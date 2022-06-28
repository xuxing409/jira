import { useQuery } from "react-query";
import { TaskType } from "types/task-type";
import { useHttp } from "./http";

export const useTaskTypes = () => {
  const client = useHttp();

  // 第一个参数用数组 数组第一位为存储标识，第二位放依赖
  return useQuery<TaskType[]>(["taskTypes"], () => client("taskTypes"));
};

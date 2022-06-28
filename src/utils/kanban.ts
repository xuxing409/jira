import { useQuery } from "react-query";
import { Kanban } from "types/kanban";
import { useHttp } from "./http";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  // 第一个参数用数组 数组第一位为存储标识，第二位放依赖
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};

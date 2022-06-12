import { useEffect } from "react";
import { cleanObject } from "utils";
import { useHttp } from "utils/http";
import { useAsync } from "utils/use-async";
import { Project } from "./list";

// Partial 将类型中的属性变为全部可选
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  useEffect(() => {
    run(client("projects", { data: cleanObject(param || {}) }));

    // 依赖项里加上client会无线循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  return result;
};

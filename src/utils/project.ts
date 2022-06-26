import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { cleanObject } from "utils";
import { useHttp } from "utils/http";
import { useAsync } from "utils/use-async";
import { Project } from "../screens/project-list/list";

// Partial 将类型中的属性变为全部可选
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  // 第一个参数用数组 数组第二位放依赖
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

// 编辑
export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      // 清除缓存
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};
// 添加
export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    {
      // 清除缓存
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id), // id有值才触发
    }
  );
};

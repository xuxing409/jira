import { useCallback, useEffect } from "react";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { useHttp } from "utils/http";
import { Project } from "screens/project-list/list";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-option";

// Partial 将类型中的属性变为全部可选
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  // 第一个参数用数组 数组第二位放依赖
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

// 编辑
export const useEditProject = (queryKey: QueryKey) => {
  // 异步请求
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );
};
// 添加
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};
// 删除
export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
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

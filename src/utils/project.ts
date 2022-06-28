import { useCallback, useEffect } from "react";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { useHttp } from "utils/http";
import { Project } from "types/project";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-option";

// Partial 将类型中的属性变为全部可选
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  // useQuery（查）第一个参数用数组 数组第一位为存储标识(作为useQuery查询的唯一标识，该值唯一)，
  // 第二位放依赖
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

// 编辑
export const useEditProject = (queryKey: QueryKey) => {
  // 异步请求
  const client = useHttp();

  // useMutation（增、改、删）操作
  // 第一个参数用于执行操作,执行返回的mutate函数，
  // 传给mutate的参数会作为useMutation第一个回调函数的参数
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

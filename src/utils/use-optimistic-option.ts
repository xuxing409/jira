import { QueryKey, useQueryClient } from "react-query";

// 用来生成useMution中的config
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();

  return {
    // 操作成功后清除缓存
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    // useMutation 一发生就立刻调用 做乐观更新
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        // 从缓存中查找项目,将修改的项目替换老的项目
        return callback(target, old);
      });
      // 这里返回的可以在onError处拿到
      return { previousItems };
    },
    // 发生错误时
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context?.previousItems);
    },
  };
};

// 删除、修改、添加的乐观更新
export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));

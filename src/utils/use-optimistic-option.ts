import { QueryKey, useQueryClient } from "react-query";
import { Task } from "types/task";
import { reorder } from "./reorder";

// 用来生成useMution中的config
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();

  return {
    // 操作成功后执行：invalidateQueries 让缓存失效，失效就会重新获取
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

// 删除、修改、添加的乐观更新 使用useConfig生成参数
export const useDeleteConfig = (queryKey: QueryKey) =>
  // 函数第二个参数为函数，接收当前更新的对象和内存中旧的缓存对象
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

// 看板、任务的拖拽乐观更新
export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });

export interface Task {
  id: number;
  name: string;
  processorId: number; // 经办人
  projectId: number;
  epicId: number; // 任务组
  kanbanId: number;
  // bug or task
  typeId: number;
  note: string;
}

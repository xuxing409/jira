import React, { useCallback } from "react";
import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, MenuProps, Modal } from "antd";
import { CreateTask } from "./create-task";
import { Task } from "types/task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import { Drag, Drop, DropChild } from "components/drap-and-drop";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((tasktype) => tasktype.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img alt="task-icon" src={name === "task" ? taskIcon : bugIcon} />;
};
const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();

  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      key={task.id}
    >
      <p>
        <Mark keyword={keyword} name={task.name} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  // 通过url获取参数，再作为请求参数请求所有task列表
  const { data: allTasks } = useTasks(useTasksSearchParams());
  // 获取指定看板类型的任务
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

  return (
    <Container ref={ref} {...props}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id} />
      </Row>

      <TasksContainer>
       <Drop type={'ROW'} direction={'vertical'} droppableId={ String(kanban.id)}>
        <DropChild style={{minHeight:'5px'}}>
        {tasks?.map((task,taskIndex) => (
         <Drag key={task.id} index={taskIndex} draggableId={'task'+ task.id}>
          <div>
          <TaskCard key={task.id} task={task} />
          </div>
         </Drag>
        ))}
        </DropChild>
       </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  );
});
const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());

  const startDelete = useCallback(() => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  }, [mutateAsync, kanban]);

  const items: MenuProps["items"] = [{ key: "delete", label: "删除" }];
  const handleClick = useCallback(
    (e: { key: string }) => {
      if (e.key === "delete") {
        startDelete();
      }
    },
    [startDelete]
  );

  return (
    <Dropdown overlay={<Menu onClick={handleClick} items={items} />}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;
const TasksContainer = styled.div`
  flex: 1;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

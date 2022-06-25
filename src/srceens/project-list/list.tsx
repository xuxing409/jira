import { Dropdown, Menu, MenuProps, Table, TableProps } from "antd";
import { ButtonNoPadding } from "components/lib";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEditProject } from "utils/project";
import { projectListActions } from "./project-list.slice";
import { User } from "./search-panel";
// TODO 将所有id类型改为number
export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}
// 通过继承TableProps 实现将所有属性一次性传递到table上
interface ListProps extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}

export const List = ({ users, ...props }: ListProps) => {
  const dispatch = useDispatch()
  const { mutate } = useEditProject();
  // project.id 一开始就拿得到， pin要等变化时才能拿到
  // 使用函数柯里化,分步储存参数
  const pinProject = (id: number) => (pin: boolean) =>
    mutate({ id, pin }).then(props.refresh);

  const items: MenuProps["items"] = [
    { label: "编辑", key: "edit" }, // 菜单项务必填写 key
    { label: "编辑", key: "edit1" }, // 菜单项务必填写 key
  ];

  const handleClick: MenuProps["onClick"] = useCallback(
    (e: { key: string }) => {  
      switch (e.key) {
        case "edit":
          dispatch(projectListActions.openProjectModal())
          break;
      }
    },
    [dispatch]
  );
  return (
    <Table
      pagination={false}
      rowKey={"id"}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            // react-router to 会默认添加到父路由后面
            return <Link to={`${project.id}`}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },

        {
          title: "负责人",
          dataIndex: "responsePerson",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "created",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return (
              <Dropdown overlay={<Menu onClick={handleClick} items={items} />}>
                <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
              </Dropdown>
            );
          },
        },
      ]}
      {...props}
    />
  );
};

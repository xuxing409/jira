import { Table, TableProps } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { User } from "./search-panel";
// TODO 将所有id类型改为number
export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: string;
  organization: string;
  created: number;
}
// 通过继承TableProps 实现将所有属性一次性传递到table上
interface ListProps extends TableProps<Project> {
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  return (
    <Table
      pagination={false}
      rowKey={"id"}
      columns={[
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
      ]}
      {...props}
    />
  );
};

import { Table } from "antd";
import React from "react";
import { User } from "./search-panel";
interface Project {
  id: string;
  name: string;
  personId: string;
  pin: string;
  prganization: string;
}
interface ListProps {
  users: User[];
  list: Project[];
}
export const List = ({ users, list }: ListProps) => {
  return (
    <Table
      pagination={false}
      columns={[
        {
          title: "名称",
          dataIndex: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span key={project.personId}>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
      ]}
      dataSource={list}
    />
  );
};

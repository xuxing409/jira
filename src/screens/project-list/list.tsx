import { Dropdown, Menu, MenuProps, Modal, Table, TableProps } from "antd";
import { ButtonNoPadding } from "components/lib";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import type { MenuInfo } from "rc-menu/lib/interface";
import { Link } from "react-router-dom";
import { useDeleteProject, useEditProject } from "utils/project";
import { User } from "../../types/user";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { Project } from "types/project";
// 通过继承TableProps 实现将所有属性一次性传递到table上
interface ListProps extends TableProps<Project> {
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());

  // 修改收藏项目:project.id 一开始就拿得到， pin要等变化时才能拿到
  // 使用函数柯里化,分步储存参数
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });

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
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const items: MenuProps["items"] = [
    { label: "编辑", key: "edit" }, // 菜单项务必填写 key
    { label: "删除", key: "delete" }, // 菜单项务必填写 key
  ];
  // 编辑项目

  const { startEdit } = useProjectModal();
  const editProject = useCallback((id: number) => startEdit(id), [startEdit]);

  // 获取删除请求方法
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  // 确定框
  const confirmDeleteProject = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "确定删除这个项目吗?",
        content: "点击确定删除",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          deleteProject({ id });
        },
      });
    },
    [deleteProject]
  );

  const handleClick = useCallback(
    (e: MenuInfo, project: Project) => {
      switch (e.key) {
        case "edit":
          editProject(project.id);
          break;
        case "delete":
          confirmDeleteProject(project.id);
          break;
      }
    },
    [editProject, confirmDeleteProject]
  );

  return (
    <Dropdown
      overlay={<Menu onClick={(e) => handleClick(e, project)} items={items} />}
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};

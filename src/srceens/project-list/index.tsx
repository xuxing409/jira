import { useState } from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "utils";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { useProjects } from "../../utils/project";
import { useUsers } from "utils/user";
import { useProjectsSearchParam } from "./util";
import { Row } from "components/lib";

interface ProjectListScreenProps {
  setProjectModalOpen: (isOpen: boolean) => void;
}

export const ProjectListScreen = (props: ProjectListScreenProps) => {
  useDocumentTitle("项目列表", false);
  // react hook
  // 获取SearchQuery参数
  const [param, setParam] = useProjectsSearchParam();
  // custom hook
  // 获取列表
  const {
    isLoading,
    error,
    data: list,
    retry,
  } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={() => props.setProjectModalOpen(true)}>
          创建项目
        </Button>
      </Row>

      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List
        setProjectModalOpen={props.setProjectModalOpen}
        refresh={retry}
        users={users || []}
        loading={isLoading}
        dataSource={list || []}
      />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true;

const Container = styled.div`
  padding: 3.2rem;
`;

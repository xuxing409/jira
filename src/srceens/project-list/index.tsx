import { useState } from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "utils";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProjects } from "../../utils/project";
import { useUsers } from "utils/user";
import { useProjectsSearchParam } from "./util";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);
  // react hook
  // 获取SearchQuery参数
  const [param,setParam] = useProjectsSearchParam()
  // custom hook
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();


  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List users={users || []} loading={isLoading} dataSource={list || []} />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true

const Container = styled.div`
  padding: 3.2rem;
`;

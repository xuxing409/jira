import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "utils";
import styled from "@emotion/styled";
import { useProjects } from "../../utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectsSearchParams } from "./util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "components/lib";
import { Profiler } from "components/profiler";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);
  const { open } = useProjectModal();
  // react hook
  // 获取SearchQuery参数
  const [param, setParam] = useProjectsSearchParams();
  // custom hook
  // 获取列表
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Profiler id={"项目列表"}>
      <ScreenContainer>
        <Row between={true}>
          <h1>项目列表</h1>

          <ButtonNoPadding onClick={open} type={"link"}>
            创建项目
          </ButtonNoPadding>
        </Row>

        <SearchPanel users={users || []} param={param} setParam={setParam} />
        <ErrorBox error={error} />
        <List users={users || []} loading={isLoading} dataSource={list || []} />
      </ScreenContainer>
    </Profiler>
  );
};

ProjectListScreen.whyDidYouRender = false;

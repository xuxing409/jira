import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "srceens/project-list";
import { ButtonNoPadding, Row } from "components/lib";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import ProjectScreen from "srceens/project";
import { resetRoute } from "utils";
import { ProjectModal } from "srceens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
/**
 * grid 和 flex 各自的应用场景
 * 1. 要考虑，是一维布局 还是 二维布局
 * 一般来说，一维布局用flex，二维布局用grid
 * 2. 是从内容出发还是从布局出发？
 * 从内容出发：你先有一组内容(数量一般不固定),然后希望他们均匀的分布在容器中，由内容自己的大小决定占据的空间
 * 从布局出发：先规划网格(数量一般比较固定)，然后再把元素往里填充
 * 从内容出发，用flex
 * 从布局出发，用grid
 *
 */

export const AuthenticatedApp = () => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  return (
    <Container>
      <PageHeader
        projectButton={
          <ButtonNoPadding
            onClick={() => setProjectModalOpen(true)}
            type={"link"}
          >
            创建项目
          </ButtonNoPadding>
        }
      />
      <Main>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to={"projects"}></Navigate>} />
            <Route
              path={"/projects"}
              element={
                <ProjectListScreen
                  setProjectModalOpen={setProjectModalOpen}
                  projectButton={
                    <ButtonNoPadding
                      onClick={() => setProjectModalOpen(true)}
                      type={"link"}
                    >
                      创建项目
                    </ButtonNoPadding>
                  }
                />
              }
            ></Route>
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            ></Route>
          </Routes>
        </Router>
      </Main>
      <ProjectModal
        projectModalOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </Container>
  );
};

const PageHeader = (props: { projectButton: JSX.Element }) => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type="link" onClick={(e) => resetRoute()}>
          <SoftwareLogo width={"18rem"} color={"rgb(38,132,255)"} />
        </ButtonNoPadding>
        <ProjectPopover {...props} />
        <span>用户</span>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};
const User = () => {
  const { logout, user } = useAuth();

  const items = [
    { label: "登出", key: "logout" }, // 菜单项务必填写 key
  ];
  const handleClick: MenuProps["onClick"] = useCallback(
    ({ key }: { key: string }) => {
      if (key === "logout") {
        logout();
      }
    },
    [logout]
  );
  return (
    <Dropdown overlay={<Menu onClick={handleClick} items={items} />}>
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

// temporal dead zone暂时性死区
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;
// grid-area 用来给grid子元素取名字
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.div``;

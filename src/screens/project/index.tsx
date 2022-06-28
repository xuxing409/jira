import React, { memo, useCallback } from "react";
import { Route, Routes, To, useLocation, useNavigate } from "react-router";
import { KanbanScreen } from "screens/kanban";
import EpicScreen from "screens/epic";
import styled from "@emotion/styled";
import { Menu, MenuProps } from "antd";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};
const ProjectScreen = memo(() => {
  const navigate = useNavigate();
  const routeType = useRouteType();
  const items: MenuProps["items"] = [
    { label: "看板", key: "kanban" }, // 菜单项务必填写 key
    { label: "任务组", key: "epic" }, // 菜单项务必填写 key
  ];
  const handleClick = useCallback(
    (e: { key: To }) => {
      navigate(e.key);
    },
    [navigate]
  );
  return (
    <Container>
      <Aside>
        <Menu items={items} selectedKeys={[routeType]} onClick={handleClick} />
        {/* <Link to={"kanban"}>看板</Link>
        <Link to={"epic"}>任务组</Link> */}
      </Aside>
      <Main>
        <Routes>
          <Route index element={<KanbanScreen />} />
          <Route path={"/kanban"} element={<KanbanScreen />}></Route>
          <Route path={"/epic"} element={<EpicScreen />}></Route>
        </Routes>
      </Main>
    </Container>
  );
});

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;
const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
`;
export default ProjectScreen;

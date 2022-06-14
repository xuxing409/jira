import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router";
import KanbanScreen from "srceens/kanban";
import EpicScreen from "srceens/epic";
const ProjectScreen = memo(() => {
  return (
    <div>
      <h1>ProjectScreen</h1>
      <Link to={"kanban"}>看板</Link>
      <Link to={"epic"}>任务组</Link>
      <Routes>
        <Route index element={<KanbanScreen />} />
        <Route path={"/kanban"} element={<KanbanScreen />}></Route>
        <Route path={"/epic"} element={<EpicScreen />}></Route>
      </Routes>
    </div>
  );
});

export default ProjectScreen;

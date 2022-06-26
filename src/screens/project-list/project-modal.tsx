import React from "react";
import { Button, Drawer } from "antd";
import { useDispatch } from "react-redux";
import {
  projectListActions,
  selectProjectModalOpen,
} from "./project-list.slice";
import { useSelector } from "react-redux";

export const ProjectModal = () => {
  const dispatch = useDispatch();
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      onClose={() => dispatch(projectListActions.closeProjectModal())}
      visible={projectModalOpen}
      width={"100%"}
    >
      <h2>Project Modal</h2>
      <Button onClick={() => dispatch(projectListActions.closeProjectModal())}>
        关闭
      </Button>
    </Drawer>
  );
};

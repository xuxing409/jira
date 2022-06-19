import React from "react";
import { Button, Drawer } from "antd";

interface ProjectModalProps {
  projectModalOpen: boolean;
  onClose: () => void;
}
export const ProjectModal = (props: ProjectModalProps) => {
  return (
    <Drawer
      onClose={props.onClose}
      visible={props.projectModalOpen}
      width={"100%"}
    >
      <h2>Project Modal</h2>
      <Button onClick={props.onClose}>关闭</Button>
    </Drawer>
  );
};

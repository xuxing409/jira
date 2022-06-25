import styled from "@emotion/styled";
import { Button, Divider, List, Popover, Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { projectListActions } from "srceens/project-list/project-list.slice";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./lib";

interface ProjectPopoverProps {
  projectButton: JSX.Element
}
export const ProjectPopover = ()=> {
  const dispatch = useDispatch()
  const {data:projcets, isLoading} = useProjects()
  const pinnedProject = projcets?.filter(project => project.pin)
  const content  = <ContentContainer>
    <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
    <List>
      {
        pinnedProject?.map(project => <List.Item>
          <List.Item.Meta title={project.name}/>
        </List.Item>)
      }
    </List>
    <Divider />
   
    <ButtonNoPadding onClick={()=> dispatch(projectListActions.openProjectModal())} type={"link"}>创建项目</ButtonNoPadding>
  </ContentContainer>
  return <Popover placement={"bottom"} content={content}>
    <span>项目</span>
  </Popover>
}


const ContentContainer = styled.div`
  min-width: 30rem;
`

import styled from "@emotion/styled";
import { Button, Divider, List, Popover, Typography } from "antd";
import React from "react";
import { useProjectModal } from "screens/project-list/util";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./lib";

// 项目悬浮框
export const ProjectPopover = ()=> {
  const {open} = useProjectModal()

  const {data:projcets, refetch} = useProjects()
  const pinnedProject = projcets?.filter(project => project.pin)
  const content  = <ContentContainer>
    <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
    <List>
      {
        pinnedProject?.map(project => <List.Item key={project.id}>
          <List.Item.Meta title={project.name}/>
        </List.Item>)
      }
    </List>
    <Divider />
    
    <ButtonNoPadding onClick={ open} type={"link"}>创建项目</ButtonNoPadding>
  </ContentContainer>
  return <Popover onVisibleChange={()=>refetch()} placement={"bottom"} content={content}>
    <span>项目</span>
  </Popover>
}


const ContentContainer = styled.div`
  min-width: 30rem;
`

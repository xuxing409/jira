import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form"
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useCallback, useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTasksModal, useTasksQueryKey } from "./util";

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16}
}

export const TaskModal = () => {
  const [form] = useForm();
  // 通过url获取 正在编辑的task
  const {editingTaskId,editingTask,close}  = useTasksModal();
  // 编辑请求函数入口
  const {mutateAsync:editTask,isLoading:editLoading} = useEditTask(useTasksQueryKey())
  const {mutateAsync:deleteTask} = useDeleteTask(useTasksQueryKey())
  
  const onCancel = () => {
    close()
    form.resetFields()
  }

  const onOk = async() => {
    await editTask({...editingTask,...form.getFieldsValue()})
    close()
  }

  
  const startDelete = useCallback(() => {
    close()
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除任务吗",
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  }, [close,deleteTask, editingTaskId]);

  useEffect(()=> {
    form.setFieldsValue(editingTask)
  },[editingTask,form])

  return <Modal forceRender={true} onCancel={onCancel} onOk={onOk} okText={'确认'} cancelText={'取消'} confirmLoading={editLoading} title={'编辑任务'} visible={!!editingTaskId}>
    <Form {...layout} initialValues={editingTask} form={form}>
      <Form.Item label={'任务名'} name={'name'} rules={[{required:true,message: '请输入任务名'}]}>
        <Input />
      </Form.Item>
      <Form.Item label={'经办人'} name={'processorId'}>
        <UserSelect defaultOptionName={'经办人'} />
      </Form.Item>
      <Form.Item label={'类型'} name={'typeId'}>
        <TaskTypeSelect />
      </Form.Item>
    </Form>
    <div style={{textAlign: 'right'}}>
      <Button onClick={startDelete}  style={{fontSize: '1.4rem'}} size={"small"}>删除</Button>
    </div>
  </Modal>
}

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false,
};

// 创建切片，
export const projectListSlice = createSlice({
  // 命名空间，可以自动的把每一个action进行独立，解决了action的type出现同名的文件。在使用的时候默认会把使用name/actionName
  name: "projectListSlice",
  initialState, //state数据的初始值
  reducers: {
    //定义的action。由于内置了immutable插件，可以直接使用赋值的方式进行数据的改变，不需要每一次都返回一个新的state数据。
    openProjectModal(state) {
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
  },
});

// 所有action
export const projectListActions = projectListSlice.actions;

// 获取项目modal 开关状态
export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;

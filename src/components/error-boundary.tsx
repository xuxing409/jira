// 错误边界组件，使用 getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。
// 常用错误边界库 https://github.com/bvaughn/react-error-boundary
import React from "react";

// children foallbackRender
type FallbackRender = (props: {error:Error|null}) => React.ReactElement

// React.PropsWithChildren 可以添加一个children:ReactNode自动合并后面<>中的类型
// type PropsWithChildren<P> = P & {children?:ReaactNode}
export class ErrorBoundary extends React.Component<React.PropsWithChildren<{fallbackRender: FallbackRender}>, {error:Error|null}> {
  
  state = {error:null}

  // 它所包裹的子组件发生异常时被调用，error会接收到异常，返回的error会赋值给state中的error
  static getDerivedStateFromError(error: Error) {
    return error
  }

  render() {
    const {error} = this.state
    const {fallbackRender,children} = this.props
    if(error){
      // 这里将error传入备用ui
      return fallbackRender({error})
    }
    return children
  }
}

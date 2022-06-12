import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { QueryClient, QueryClientProvider }  from 'react-query'
// app级别provider,children 为AppProvider包裹的组件 本项目为(App和dev-tool)
//  children 可以放到组件的children属性中，效果和以下嵌套children一致
// 但嵌套的优点是 还可以扩展嵌套别的组件

export const AppProviders = ({children}:{children:ReactNode})=> {
  // QueryClientProvider react-query
  return <QueryClientProvider client={new QueryClient()}>
    <AuthProvider>
    {children}
  </AuthProvider>
  </QueryClientProvider>
};

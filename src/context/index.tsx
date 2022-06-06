import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
// app级别provider children 可以放到组件的children属性中，效果和以下嵌套children一致
// 但嵌套的优点是 还可以扩展嵌套别的组件
export const AppProviders = ({children}:{children:ReactNode})=> {
  return <AuthProvider>
    {children}
  </AuthProvider>
};

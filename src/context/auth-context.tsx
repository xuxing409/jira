import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { User } from "types/user";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useQueryClient } from "react-query";

interface AuthForm {
  username: string;
  password: string;
}

// 初始化token
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  // token 存在则请求用户信息
  if (token) {
    // me接口解析token,返回用户信息
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

// 创建AuthContext
const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext"; // 组件名

// 全局权限信息提供组件，相当于app组件的外层组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 请求数据
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();

  const queryClient = useQueryClient();

  // point free
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      queryClient.clear();
    });

  // 整个app加载时,检查token
  useMount(() => {
    run(bootstrapUser());
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }
  return (
    // context 传递 需要将属性放入value中,
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};
// useContext 消费 获取user context 登录验证信息
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};

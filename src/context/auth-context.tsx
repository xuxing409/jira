import React, { ReactNode, useCallback } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import * as authStore from "store/auth.slice";
import { bootstrap, selectUser } from "store/auth.slice";
import { useDispatch, useSelector } from "react-redux";

export interface AuthForm {
  username: string;
  password: string;
}

// 初始化token,本地有tooken请求用户信息，返回用户信息
export const bootstrapUser = async () => {
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

// 全局权限信息提供组件，相当于app组件的外层组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);
  const { error, isLoading, isIdle, isError, run } = useAsync<User | null>();
  const dispatch: (...args: any[]) => Promise<User> = useDispatch();

  // 整个app加载时,检查token
  useMount(() => {
    run(dispatch(bootstrap()));
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }
  return <div>{children}</div>;
};
// useContext 消费 获取user context 登录验证信息
export const useAuth = () => {
  const dispatch: (...args: any[]) => Promise<User> = useDispatch();
  const user = useSelector(selectUser);

  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);

  return {
    user,
    login,
    register,
    logout,
  };
};

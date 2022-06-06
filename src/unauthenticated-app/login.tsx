import { useAuth } from "context/auth-context";
import React, { FormEvent } from "react";

export const LoginScreen = () => {
  const { login, user } = useAuth();

  const handelSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 获取form表单的用户名密码
    const username = (event.currentTarget.elements[0] as HTMLInputElement)
      .value;
    const password = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;
    login({ username, password });
  };
  return (
    <form onSubmit={handelSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        <input type="text" id="username"></input>
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input type="password" id="password"></input>
      </div>
      <button type="submit">登录</button>
    </form>
  );
};

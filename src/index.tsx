import './wdyr'; 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadServer, DevTools } from "jira-dev-tool";
// 务必在 jira-dev-tool后使用
import "antd/dist/antd.less";

import { AppProviders } from "context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
loadServer(() =>
  root.render(
    <React.StrictMode>
      {/* app级别提供者，一般用于共享全局用户信息token、主题等 */}
      <AppProviders>
        <DevTools />
        <App />
      </AppProviders>
    </React.StrictMode>
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

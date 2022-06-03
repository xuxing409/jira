import { useEffect, useState } from "react";
import qs from "qs";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { cleanObject } from "utils";

export const ProjectListScreen = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [param, setParam] = useState({ name: "", personId: "" });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(param))}`).then(
      async (response) => {
        if (response.ok) {
          setList(await response.json());
        }
      }
    );
  }, [apiUrl, param]);
  useEffect(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json());
      }
    });
  }, [apiUrl]);
  return (
    <div>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  );
};

import fetchUrl from "./common";
import common from "./common";
import IUser from "../interfaces/IUser";

async function getUserList() {
  return await fetchUrl<IUser[]>("user/");
}

async function getUser(id: number | string) {
  return await fetchUrl<IUser>(`user/${id}/`);
}

async function getUserBySession(sessionId: string) {
  return await fetchUrl<IUser>(`user/session/${sessionId}/`);
}

export { getUserList, getUser, getUserBySession };

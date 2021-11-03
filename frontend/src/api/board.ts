import fetchUrl from "./common";
import common from "./common";
import IBoard from "../interfaces/IBoard";

async function getBoardList() {
  return await fetchUrl<IBoard[]>("board/");
}

async function getBoard(id: number | string) {
  return await fetchUrl<IBoard>(`board/${id}/`);
}

export { getBoardList, getBoard };

import fetchUrl from "./common";
import IColumn, {
  IColumnUpdate,
  IColumnSubmission,
} from "../interfaces/IColumn";

async function createColumn(column: IColumnSubmission) {
  return await fetchUrl<IColumn>("column", "POST", column);
}

async function updateColumn(id: number, column: IColumnUpdate) {
  return await fetchUrl<IColumn>(`column/${id}`, "PUT", column);
}

// async function patchPositions(positionUpdates: IPostPositionUpdate[]) {
//   return await fetchUrl<void>("post/positions", "PATCH", {
//     posts: positionUpdates,
//   });
// }

async function deleteColumn(id: number) {
  return await fetchUrl<void>(`column/${id}`, "DELETE");
}

export { createColumn, updateColumn, deleteColumn };

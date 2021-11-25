import IPost from "./IPost";

export default interface IColumn {
  id: number;
  name: string;
  position: number;
  posts: IPost[];
  board: number;
}

export interface IColumnUpdate {
  id: number;
  name: string;
  position: number;
  board: number;
}

export interface IColumnSubmission {
  name: string;
  position: number;
  board: number;
}

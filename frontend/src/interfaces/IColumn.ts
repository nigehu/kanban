import IPost from "./IPost";

export default interface IColumn {
  id: number;
  name: string;
  position: number;
  posts: IPost[];
}

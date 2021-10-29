import IUser from "./IUser";
import IColumn from "./IColumn";

export default interface IBoard {
  id: number;
  name: string;
  user: IUser;
  columns: IColumn[];
}

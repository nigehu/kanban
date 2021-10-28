import { IUser } from "./IUser";

export default interface IBoard {
  id: number;
  name: string;
  user: IUser;
}

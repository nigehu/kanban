import IUser from "./IUser";

export default interface IPost {
  id: number;
  title: string;
  position: number;
  description: string;
  due_date: string;
  created: string;
  assigned?: IUser;
  column: number;
}

export interface IPostSubmission {
  title: string;
  position: number;
  description: string;
  due_date: string;
  assigned?: number;
  column: number;
}

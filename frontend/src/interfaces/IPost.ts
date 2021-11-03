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

export interface IPostEditing extends Omit<IPost, "due_date"> {
  due_date: Date;
}

export interface IPostUpdate extends Omit<IPost, "assigned"> {
  assigned: number;
}

export interface IPostPositionUpdate {
  id: number;
  position: number;
  column: number;
}

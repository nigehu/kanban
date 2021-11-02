export default interface IUser {
  id: number;
  session_id: string;
  username: string;
  first_name: string;
  last_name: string;
  created: string;
}

interface IUserSubmission {
  username: string;
  first_name: string;
  last_name: string;
}

export { IUserSubmission };

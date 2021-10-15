interface IUser {
  session_id: number;
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

export { IUser, IUserSubmission };

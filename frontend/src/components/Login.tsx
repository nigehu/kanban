import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  DialogContentText,
  Fade,
} from "@mui/material";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { getUserBySession } from "../api/user";
import IUser, { IUserSubmission } from "../interfaces/IUser";
import { setMe } from "../store/meSlice";
import { useAppSelector, useAppDispatch } from "../store/hooks";

interface ILogin {
  children: ReactNode;
}

function Login({ children }: ILogin) {
  const [sessionUser, setSessionUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const me = useAppSelector((state) => state.me.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const sessionId = localStorage.getItem("session_id");
      if (sessionId) {
        const responseUser = await getUserBySession(sessionId);
        dispatch(setMe(responseUser));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const signIn = () => {
    setLoading(true);
    // TODO: replace with api helper
    fetch(`/api/user/?username=${username}`).then(async (response) => {
      if (response.status === 401 || response.status === 204) {
        return;
      }
      try {
        const data: IUser | undefined = await response.json();
        if (response.ok && data) {
          dispatch(setMe(data));
          localStorage.setItem("session_id", data.session_id.toString());
          setLoading(false);
        } else {
          setLoading(false);
          return Promise.reject(data);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        if (response.ok) {
          return true;
        }
      }
    });
  };

  const createNewUser = () => {
    const user: IUserSubmission = {
      username: username,
      first_name: firstName,
      last_name: lastName,
    };
    // TODO: replace with api helper
    fetch(`/api/user/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(async (response) => {
      if (response.status === 401 || response.status === 204) {
        return;
      }
      try {
        const data: IUser | undefined = await response.json();
        if (response.ok && data) {
          dispatch(setMe(data));
          localStorage.setItem("session_id", data.session_id.toString());
          setLoading(false);
        } else {
          setLoading(false);
          return Promise.reject(data);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        if (response.ok) {
          return true;
        }
      }
    });
  };

  const refuseSessionUser = () => {
    setSessionUser(undefined);
  };

  const confirmSessionUser = () => {
    dispatch(setMe(sessionUser));
    refuseSessionUser();
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  if (loading) {
    return (
      <Fade in={true}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        ></Box>
      </Fade>
    );
  }

  if (me) {
    return <>{children}</>;
  }

  if (sessionUser) {
    return (
      <Dialog open fullWidth maxWidth="sm">
        <DialogTitle>Are you {sessionUser.username}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Is your name {sessionUser.first_name} {sessionUser.last_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={refuseSessionUser}>No</Button>
          <Button onClick={confirmSessionUser}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (newUser) {
    return (
      <Dialog open fullWidth maxWidth="sm">
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter user details</DialogContentText>
          <Box sx={{ p: 1 }}>
            <TextField
              label="Username"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
              sx={{ my: 1 }}
            />
            <TextField
              label="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              fullWidth
              sx={{ my: 1 }}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              fullWidth
              sx={{ my: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={createNewUser}>Create New User</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Enter Username</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your username to begin using the Kanban Board or Create a
          new user:
        </DialogContentText>
        <Box sx={{ p: 1 }}>
          <TextField
            label="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNewUser(true)}>Create New User</Button>
        <Button onClick={signIn}>Sign In</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Login;

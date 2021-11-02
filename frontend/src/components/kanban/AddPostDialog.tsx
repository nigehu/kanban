import { DatePicker } from "@mui/lab";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputBase,
  styled,
  TextField,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import { formatISO } from "date-fns";
import React, { useState, ChangeEvent, useEffect } from "react";
import IColumn from "../../interfaces/IColumn";
import IPost, { IPostSubmission } from "../../interfaces/IPost";
import IUser from "../../interfaces/IUser";

const StyledTextField = styled(OutlinedInput)(({ theme }) => ({
  transition: theme.transitions.create("width"),
  width: 200,
  "&:focus-within": {
    width: "100%",
  },
}));

interface IAddPostDialog {
  column: IColumn;
  users: IUser[];
  savePost: (post: IPostSubmission) => void;
}

export default function AddPostDialog({
  column,
  users,
  savePost,
}: IAddPostDialog) {
  const [valid, setValid] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [assignedId, setAssignedId] = useState<number>(0);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (title !== "") {
      setValid(true);
    } else if (valid) {
      setValid(false);
    }
  }, [valid, title]);

  const handleAssignedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(event.target.value);
    setAssignedId(id);
  };

  const handleAddPostClick = () => {
    const post = {
      title: title,
      position: 0,
      description: description,
      due_date: formatISO(dueDate),
      assigned: assignedId,
      column: column.id,
    } as IPostSubmission;
    savePost(post);
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Add item to {column.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter details for new item in {column.name}
        </DialogContentText>
        <Grid container sx={{ p: 1 }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              multiline
              error={title === ""}
              helperText={title === "" ? "A Title is required" : ""}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              id="assigned-user-select"
              select
              label="Assigned To"
              value={assignedId}
              onChange={handleAssignedChange}
              fullWidth
            >
              <MenuItem value={0}>Unassigned</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {`${u.first_name} ${u.last_name}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item md={8}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newDate) => {
                setDueDate(newDate);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={params?.inputProps?.placeholder}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button disabled={!valid} onClick={handleAddPostClick}>
          Add Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}

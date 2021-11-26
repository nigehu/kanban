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
import IPost, { IPostEditing, IPostSubmission } from "../../interfaces/IPost";
import IUser from "../../interfaces/IUser";

interface IAddPostDialog {
  passedPost: IPost;
  users: IUser[];
  savePostEdits: (post: IPost) => void;
  cancelPostEdits: () => void;
  deletePost: () => void;
}

export default function EditPostDialog({
  passedPost,
  users,
  savePostEdits,
  cancelPostEdits,
  deletePost,
}: IAddPostDialog) {
  const [post, setPost] = useState<IPostEditing | null>(null);
  const [valid, setValid] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    setPost({ ...passedPost, due_date: new Date(passedPost.due_date) });
  }, [passedPost]);

  useEffect(() => {
    if (post) {
      if (post.title !== "") {
        setValid(true);
      } else if (valid) {
        setValid(false);
      }
    }
  }, [valid, post?.title]);

  const handleAssignedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(event.target.value);
    const newUser = users.find((u) => u.id === id);
    setPost({ ...post, assigned: newUser });
  };

  const handleSavePostClick = () => {
    savePostEdits({ ...post, due_date: formatISO(post.due_date) } as IPost);
  };

  if (!post) return null;

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Edit {passedPost.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter details for {passedPost.title}
        </DialogContentText>
        <Grid container sx={{ p: 1 }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              fullWidth
              multiline
              error={post.title === ""}
              helperText={post.title === "" ? "A Title is required" : ""}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              id="assigned-user-select"
              select
              label="Assigned To"
              value={post.assigned ? post.assigned.id : 0}
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
              value={post.due_date}
              onChange={(newDate) => {
                setPost({ ...post, due_date: newDate });
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
              value={post.description}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => setDeleteConfirmOpen(true)}
          variant="outlined"
        >
          Delete
        </Button>
        <Button color="error" onClick={cancelPostEdits}>
          Cancel
        </Button>
        <Button disabled={!valid} onClick={handleSavePostClick}>
          Save
        </Button>
      </DialogActions>
      <Dialog open={deleteConfirmOpen}>
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={deletePost}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

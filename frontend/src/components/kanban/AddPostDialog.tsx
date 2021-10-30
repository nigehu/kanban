import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import IColumn from "../../interfaces/IColumn";
import IPost from "../../interfaces/IPost";

interface IAddPostDialog {
  column: IColumn;
}

export default function AddPostDialog({ column }: IAddPostDialog) {
  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Add item to {column.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter details for new item in {column.name}
        </DialogContentText>
        <Box sx={{ p: 1 }}>
          <TextField label="Title" />
          <TextField label="Assigned To" />
          <TextField label="Description" />
          <TextField label="Due Date" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button>Create New User</Button>
        <Button>Sign In</Button>
      </DialogActions>
    </Dialog>
  );
}

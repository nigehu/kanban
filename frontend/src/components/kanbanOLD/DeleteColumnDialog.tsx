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

interface IDeleteColumnDialog {
  column: IColumn;
  handleDeleteColumn: () => void;
  handleCancel: () => void;
}

export default function DeleteColumnDialog({
  column,
  handleDeleteColumn,
  handleCancel,
}: IDeleteColumnDialog) {
  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Delete {column.name}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {column.name} while there are still
          posts? This will delete all posts inside of the column as well.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleDeleteColumn}>Delete Column</Button>
      </DialogActions>
    </Dialog>
  );
}
